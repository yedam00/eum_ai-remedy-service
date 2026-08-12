# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e7]:
        - button "뒤로 가기" [ref=e8] [cursor=pointer]:
          - img "Arrow" [ref=e10]
        - generic [ref=e13]: 홈
      - generic [ref=e14]:
        - generic [ref=e17]:
          - img [ref=e20]
          - paragraph [ref=e24]: 두통이 있어요
        - paragraph [ref=e27]: 어떤 증상을 느끼시나요?
      - generic [ref=e30]:
        - generic [ref=e31]:
          - button "예" [ref=e32] [cursor=pointer]:
            - img [ref=e35]
            - generic [ref=e38]: 예
          - button "아니오" [ref=e39] [cursor=pointer]:
            - img [ref=e42]
            - generic [ref=e45]: 아니오
          - button "모르겠음" [ref=e46] [cursor=pointer]:
            - img [ref=e49]
            - generic [ref=e52]: 모르겠음
        - generic [ref=e53]:
          - textbox "두통, 어지러움" [ref=e55]
          - button "음성 입력" [ref=e56] [cursor=pointer]:
            - img [ref=e59]
  - alert [ref=e62]
```