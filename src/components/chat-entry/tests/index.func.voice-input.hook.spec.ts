/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-this-alias */

import { test, expect } from "@playwright/test";

test.describe("VoiceInput Hook - 성공 시나리오", () => {
  test.beforeEach(async ({ page, context }) => {
    // microphone 권한 자동 허용
    await context.grantPermissions(["microphone"]);
    
    // /chat-entry 페이지로 이동
    await page.goto("/chat-entry");
    
    // 페이지 로드 완료 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="chat-entry-container"]');
  });

  test("1. 누르고 말하기 버튼 클릭 시 VoiceInputSheet 모달 오픈", async ({ page }) => {
    // 누르고 말하기 버튼 클릭
    await page.click('[data-testid="voice-press-button"]');
    
    // VoiceInputSheet 모달이 열렸는지 확인
    await expect(page.locator('[data-testid="voice-modal"]')).toBeVisible();
  });

  test.skip("2. 마이크 입력에 따른 audioLevel 및 title 실시간 반영", async ({ page }) => {
    // Web Speech API Mock 설정
    await page.addInitScript(() => {
      let recognition: any;
      
      // @ts-ignore
      window.SpeechRecognition = window.SpeechRecognition || class MockSpeechRecognition {
        continuous = true;
        interimResults = true;
        lang = "ko-KR";
        
        onstart: ((event: any) => void) | null = null;
        onresult: ((event: any) => void) | null = null;
        onerror: ((event: any) => void) | null = null;
        onend: ((event: any) => void) | null = null;
        
        start() {
          recognition = this;
          setTimeout(() => {
            if (this.onstart) {
              this.onstart({});
            }
            
            // 시뮬레이션: "두통이" (중간 결과)
            setTimeout(() => {
              if (this.onresult) {
                this.onresult({
                  results: [
                    [{ transcript: "두통이", isFinal: false }]
                  ],
                  resultIndex: 0
                });
              }
            }, 100);
            
            // 시뮬레이션: "두통이 있어요" (최종 결과)
            setTimeout(() => {
              if (this.onresult) {
                this.onresult({
                  results: [
                    [{ transcript: "두통이 있어요", isFinal: true }]
                  ],
                  resultIndex: 0
                });
              }
            }, 200);
          }, 50);
        }
        
        stop() {
          setTimeout(() => {
            if (this.onend) {
              this.onend({});
            }
          }, 10);
        }
        
        abort() {
          this.stop();
        }
      };
      
      // AudioContext Mock (audioLevel 분석용)
      // @ts-ignore
      window.AudioContext = window.AudioContext || class MockAudioContext {
        createMediaStreamSource() {
          return {
            connect: () => {}
          };
        }
        
        createAnalyser() {
          return {
            fftSize: 256,
            frequencyBinCount: 128,
            connect: () => {},
            getByteFrequencyData: (array: Uint8Array) => {
              // 시뮬레이션: 초반 높은 레벨, 점차 감소
              const elapsed = Date.now() - (window as any).__audioStartTime;
              if (elapsed < 500) {
                array.fill(200); // 높은 레벨
              } else if (elapsed < 1000) {
                array.fill(100); // 중간 레벨
              } else {
                array.fill(0); // 무음
              }
            }
          };
        }
      };
      
      // getUserMedia Mock
      if (navigator.mediaDevices) {
        const original = navigator.mediaDevices.getUserMedia;
        navigator.mediaDevices.getUserMedia = async (constraints) => {
          (window as any).__audioStartTime = Date.now();
          // @ts-ignore
          return new MediaStream();
        };
      }
    });
    
    // 누르고 말하기 버튼 클릭
    await page.click('[data-testid="voice-press-button"]');
    
    // 모달이 열릴 때까지 대기
    await page.waitForSelector('[data-testid="voice-modal"]');
    
    // title이 실시간으로 업데이트 되는지 확인 (최종적으로 "두통이 있어요"가 표시되어야 함)
    await page.waitForSelector('text="두통이 있어요"', { timeout: 3000 });
  });

  test.skip("3-5. 2초 무음 감지 → Success → /chat 이동 → SpeechBubble 노출", async ({ page }) => {
    // Web Speech API Mock 설정
    await page.addInitScript(() => {
      let recognition: any;
      
      // @ts-ignore
      window.SpeechRecognition = window.SpeechRecognition || class MockSpeechRecognition {
        continuous = true;
        interimResults = true;
        lang = "ko-KR";
        
        onstart: ((event: any) => void) | null = null;
        onresult: ((event: any) => void) | null = null;
        onerror: ((event: any) => void) | null = null;
        onend: ((event: any) => void) | null = null;
        
        start() {
          recognition = this;
          setTimeout(() => {
            if (this.onstart) {
              this.onstart({});
            }
            
            // 시뮬레이션: "두통이 있어요" (최종 결과)
            setTimeout(() => {
              if (this.onresult) {
                this.onresult({
                  results: [
                    [{ transcript: "두통이 있어요", isFinal: true }]
                  ],
                  resultIndex: 0
                });
              }
            }, 100);
          }, 50);
        }
        
        stop() {
          setTimeout(() => {
            if (this.onend) {
              this.onend({});
            }
          }, 10);
        }
        
        abort() {
          this.stop();
        }
      };
      
      // AudioContext Mock
      // @ts-ignore
      window.AudioContext = window.AudioContext || class MockAudioContext {
        createMediaStreamSource() {
          return {
            connect: () => {}
          };
        }
        
        createAnalyser() {
          return {
            fftSize: 256,
            frequencyBinCount: 128,
            connect: () => {},
            getByteFrequencyData: (array: Uint8Array) => {
              // 시뮬레이션: 초반 높은 레벨, 0.5초 후 무음
              const elapsed = Date.now() - (window as any).__audioStartTime;
              if (elapsed < 500) {
                array.fill(200);
              } else {
                array.fill(0); // 2초간 무음 유지
              }
            }
          };
        }
      };
      
      if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia = async () => {
          (window as any).__audioStartTime = Date.now();
          // @ts-ignore
          return new MediaStream();
        };
      }
    });
    
    // 누르고 말하기 버튼 클릭
    await page.click('[data-testid="voice-press-button"]');
    
    // 모달이 열릴 때까지 대기
    await page.waitForSelector('[data-testid="voice-modal"]');
    
    // /chat 페이지로 이동되었는지 확인 (2초 무음 후 자동 이동)
    await page.waitForURL("/chat?text=두통이+있어요", { timeout: 5000 });
    
    // chat 페이지 로드 확인
    await page.waitForSelector('[data-testid="chat-container"]');
    
    // 사용자 SpeechBubble에 입력된 텍스트가 노출되는지 확인
    const userBubble = page.locator('[data-variant="user"]');
    await expect(userBubble).toBeVisible();
    await expect(userBubble).toContainText("두통이 있어요");
  });
});

test.describe("VoiceInput Hook - 실패/폴백 시나리오", () => {
  test.beforeEach(async ({ page, context }) => {
    // microphone 권한 자동 허용
    await context.grantPermissions(["microphone"]);
  });

  test("Web Speech API 미지원 → Fallback 텍스트 → /chat 이동", async ({ page }) => {
    // Web Speech API 미지원 환경 Mock
    await page.addInitScript(() => {
      // SpeechRecognition 제거
      // @ts-ignore
      delete window.SpeechRecognition;
      // @ts-ignore
      delete window.webkitSpeechRecognition;
      
      // AudioContext는 정상 작동
      // @ts-ignore
      window.AudioContext = window.AudioContext || class MockAudioContext {
        createMediaStreamSource() {
          return {
            connect: () => {}
          };
        }
        
        createAnalyser() {
          return {
            fftSize: 256,
            frequencyBinCount: 128,
            connect: () => {},
            getByteFrequencyData: (array: Uint8Array) => {
              array.fill(0);
            }
          };
        }
      };
      
      if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia = async () => {
          // @ts-ignore
          return new MediaStream();
        };
      }
    });
    
    // /chat-entry 페이지로 이동
    await page.goto("/chat-entry");
    
    // 페이지 로드 완료 대기
    await page.waitForSelector('[data-testid="chat-entry-container"]');
    
    // 누르고 말하기 버튼 클릭
    await page.click('[data-testid="voice-press-button"]');
    
    // 모달이 열릴 때까지 대기
    await page.waitForSelector('[data-testid="voice-modal"]');
    
    // 2초 후 Fallback 텍스트가 생성되고 /chat으로 이동
    await page.waitForURL(/\/chat\?text=/, { timeout: 5000 });
    
    // chat 페이지 로드 확인
    await page.waitForSelector('[data-testid="chat-container"]');
    
    // 사용자 SpeechBubble에 Fallback 텍스트가 노출되는지 확인
    const userBubble = page.locator('[data-variant="user"]');
    await expect(userBubble).toBeVisible();
    await expect(userBubble).toContainText("배가 쑤시듯이 아파요");
  });
});
