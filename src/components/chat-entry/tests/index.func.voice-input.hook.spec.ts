import { test, expect, type Page } from "@playwright/test";

const LAST_USER_BUBBLE_TEST_ID = "last-user-bubble";

type RecognitionHandler = ((event: Event) => void) | null;
type TranscriptEmitter = (transcript: string, isFinal: boolean) => void;

const getAudioElapsedMs = () => {
  const startTime = Reflect.get(window, "__audioStartTime");
  return typeof startTime === "number" ? Date.now() - startTime : 0;
};

const emitTranscript = (
  handler: RecognitionHandler,
  transcript: string,
  isFinal: boolean
) => {
  handler?.(
    Object.assign(new Event("result"), {
      results: [[{ transcript, isFinal }]],
      resultIndex: 0,
    })
  );
};

const createMockAudioContext = (fillLevel: (array: Uint8Array) => void) =>
  class MockAudioContext {
    createMediaStreamSource() {
      return { connect: () => undefined };
    }

    createAnalyser() {
      return {
        fftSize: 256,
        frequencyBinCount: 128,
        connect: () => undefined,
        getByteFrequencyData: fillLevel,
      };
    }

    close() {
      return Promise.resolve();
    }
  };

const stubMicrophone = () => {
  if (!navigator.mediaDevices) return;
  navigator.mediaDevices.getUserMedia = async () => {
    Object.defineProperty(window, "__audioStartTime", {
      configurable: true,
      writable: true,
      value: Date.now(),
    });
    return new MediaStream();
  };
};

const installWindowApi = (
  SpeechRecognition: unknown,
  AudioContext: unknown
) => {
  Object.defineProperty(window, "SpeechRecognition", {
    configurable: true,
    writable: true,
    value: SpeechRecognition,
  });
  Object.defineProperty(window, "AudioContext", {
    configurable: true,
    writable: true,
    value: AudioContext,
  });
};

const createMockSpeechRecognition = (
  onStart: (emit: TranscriptEmitter) => void
) =>
  class MockSpeechRecognition {
    continuous = true;
    interimResults = true;
    lang = "ko-KR";
    onstart: RecognitionHandler = null;
    onresult: RecognitionHandler = null;
    onerror: RecognitionHandler = null;
    onend: RecognitionHandler = null;

    start() {
      window.setTimeout(() => {
        this.onstart?.(new Event("start"));
        onStart((transcript, isFinal) => {
          emitTranscript(this.onresult, transcript, isFinal);
        });
      }, 50);
    }

    stop() {
      window.setTimeout(() => {
        this.onend?.(new Event("end"));
      }, 10);
    }

    abort() {
      this.stop();
    }
  };

const installSpeechRecognitionMock = () => {
  const MockSpeechRecognition = createMockSpeechRecognition((emit) => {
    window.setTimeout(() => emit("두통이", false), 100);
    window.setTimeout(() => emit("두통이 있어요", true), 200);
  });
  const MockAudioContext = createMockAudioContext((array) => {
    const elapsed = getAudioElapsedMs();
    if (elapsed < 500) {
      array.fill(200);
    } else if (elapsed < 1000) {
      array.fill(100);
    } else {
      array.fill(0);
    }
  });
  installWindowApi(MockSpeechRecognition, MockAudioContext);
  stubMicrophone();
};

const installSpeechRecognitionSilenceMock = () => {
  const MockSpeechRecognition = createMockSpeechRecognition((emit) => {
    window.setTimeout(() => emit("두통이 있어요", true), 100);
  });
  const MockAudioContext = createMockAudioContext((array) => {
    array.fill(getAudioElapsedMs() < 500 ? 200 : 0);
  });
  installWindowApi(MockSpeechRecognition, MockAudioContext);
  stubMicrophone();
};

const installUnsupportedSpeechMock = () => {
  Reflect.deleteProperty(window, "SpeechRecognition");
  Reflect.deleteProperty(window, "webkitSpeechRecognition");
  installWindowApi(
    undefined,
    createMockAudioContext((array) => {
      array.fill(0);
    })
  );
  if (navigator.mediaDevices) {
    navigator.mediaDevices.getUserMedia = async () => new MediaStream();
  }
};

const getUserWrapOffset = (page: Page) =>
  page.evaluate(() => {
    const content = document.querySelector('[data-testid="chat-content"]');
    const wrap = document.querySelector(
      '[data-testid="last-user-bubble"] > div'
    );
    if (!(content instanceof HTMLElement) || !(wrap instanceof HTMLElement)) {
      return Number.POSITIVE_INFINITY;
    }
    return (
      wrap.getBoundingClientRect().top - content.getBoundingClientRect().top
    );
  });

test.describe("VoiceInput Hook - 성공 시나리오", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(["microphone"]);
    await page.goto("/chat-entry");
    await page.waitForSelector('[data-testid="chat-entry-container"]');
  });

  test("누르고 말하기 버튼 클릭 시 VoiceInputSheet 모달 오픈", async ({
    page,
  }) => {
    // Given: /chat-entry 페이지가 로드된 상태
    const voiceButton = page.locator('[data-testid="voice-press-button"]');
    await expect(voiceButton).toBeVisible();

    // When: 누르고 말하기 버튼을 클릭한다
    await voiceButton.click();

    // Then: VoiceInputSheet 모달이 화면에 나타난다
    await expect(page.locator('[data-testid="voice-modal"]')).toBeVisible();
  });

  test.skip("마이크 입력에 따른 audioLevel 및 title 실시간 반영", async ({
    page,
  }) => {
    // Given: Web Speech API가 중간/최종 결과를 반환하도록 Mock된 상태
    await page.addInitScript(installSpeechRecognitionMock);
    await page.goto("/chat-entry");
    await page.waitForSelector('[data-testid="chat-entry-container"]');

    // When: 누르고 말하기 버튼을 클릭한다
    await page.click('[data-testid="voice-press-button"]');
    await expect(page.locator('[data-testid="voice-modal"]')).toBeVisible();

    // Then: 인식된 텍스트가 타이틀에 반영된다
    await expect(page.getByText("두통이 있어요")).toBeVisible();
  });

  test.skip("2초 무음 감지 후 Success 전환과 /chat 이동", async ({ page }) => {
    // Given: 최종 인식 후 무음이 유지되도록 Mock된 상태
    await page.addInitScript(installSpeechRecognitionSilenceMock);
    await page.goto("/chat-entry");
    await page.waitForSelector('[data-testid="chat-entry-container"]');

    // When: 누르고 말하기 버튼을 클릭한다
    await page.click('[data-testid="voice-press-button"]');
    await expect(page.locator('[data-testid="voice-modal"]')).toBeVisible();

    // Then: /chat으로 이동하고 사용자 말풍선에 인식 텍스트가 보인다
    await expect(page).toHaveURL("/chat?text=두통이+있어요");
    await page.waitForSelector('[data-testid="chat-container"]');
    const userBubble = page.locator(
      `[data-testid="${LAST_USER_BUBBLE_TEST_ID}"]`
    );
    await expect(userBubble).toBeVisible();
    await expect(userBubble).toContainText("두통이 있어요");
  });
});

test.describe("VoiceInput Hook - 실패/폴백 시나리오", () => {
  test.beforeEach(async ({ context }) => {
    await context.grantPermissions(["microphone"]);
  });

  test("Web Speech API 미지원 시 Fallback 텍스트로 /chat 이동", async ({
    page,
  }) => {
    // Given: Web Speech API가 없는 브라우저 환경
    await page.addInitScript(installUnsupportedSpeechMock);
    await page.goto("/chat-entry");
    await page.waitForSelector('[data-testid="chat-entry-container"]');

    // When: 누르고 말하기 버튼을 클릭한다
    await page.click('[data-testid="voice-press-button"]');
    await expect(page.locator('[data-testid="voice-modal"]')).toBeVisible();

    // Then: Fallback 텍스트와 함께 /chat으로 이동한다
    await expect(page).toHaveURL(/\/chat\?text=/);
    await page.waitForSelector('[data-testid="chat-container"]');
    const userBubble = page.locator(
      `[data-testid="${LAST_USER_BUBBLE_TEST_ID}"]`
    );
    await expect(userBubble).toBeVisible();
    await expect(userBubble).toContainText("배가 쑤시듯이 아파요");
  });
});

test.describe("Chat 자동 스크롤", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/chat?text=두통이+있어요");
    await page.waitForSelector('[data-testid="chat-container"]');
  });

  test("가장 최근 사용자 말풍선에 last-user-bubble 식별자가 있다", async ({
    page,
  }) => {
    // Given: 사용자 텍스트가 전달된 /chat 페이지
    const lastUserBubble = page.locator(
      `[data-testid="${LAST_USER_BUBBLE_TEST_ID}"]`
    );

    // When: 페이지가 렌더링된다
    // Then: 최신 사용자 말풍선이 식별자와 함께 보인다
    await expect(lastUserBubble).toBeVisible();
    await expect(lastUserBubble).toContainText("두통이 있어요");
  });

  test("AI 응답 렌더 후 userBubbleWrap이 콘텐츠 최상단에 온다", async ({
    page,
  }) => {
    // Given: 히스토리 AI, 사용자 답변, 최신 AI가 모두 렌더된 상태
    await expect(
      page.locator(`[data-testid="${LAST_USER_BUBBLE_TEST_ID}"]`)
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="chat-latest-ai-bubble"]')
    ).toBeVisible();

    // When: 레이아웃 계산 후 자동 스크롤이 완료된다
    await expect
      .poll(async () => getUserWrapOffset(page), { timeout: 1500 })
      .toBeLessThan(8);

    // Then: 사용자 말풍선 wrap이 콘텐츠 영역 상단에 위치한다
    const offset = await getUserWrapOffset(page);
    expect(offset).toBeLessThan(8);
  });

  test("이전 대화 내역이 유지되고 위로 스크롤하면 확인할 수 있다", async ({
    page,
  }) => {
    // Given: 이전 AI 질문이 히스토리에 남아 있는 상태
    const historyAi = page.locator('[data-testid="chat-history-ai-bubble"]');
    await expect(historyAi).toBeAttached();
    await expect(historyAi).toContainText("어디가 불편하신가요?");

    // When: 콘텐츠 영역을 맨 위로 스크롤한다
    await page.evaluate(() => {
      const content = document.querySelector('[data-testid="chat-content"]');
      const main = document.querySelector("main");
      if (content instanceof HTMLElement) {
        content.scrollTo({ top: 0, behavior: "instant" });
      }
      if (main instanceof HTMLElement) {
        main.scrollTo({ top: 0, behavior: "instant" });
      }
    });

    // Then: 이전 대화 내역을 다시 확인할 수 있다
    await expect(historyAi).toBeVisible();
  });
});
