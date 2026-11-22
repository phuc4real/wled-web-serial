# Desk LED / Đèn LED bàn

A static web page that controls a [WLED](https://kno.wled.ge/) light strip over USB using the browser's Web Serial API. No app, no server, no Wi-Fi needed.

Trang web tĩnh điều khiển dải LED chạy WLED qua cổng USB bằng Web Serial của trình duyệt. Không cần cài app, không cần server, không cần Wi-Fi.

## Features / Tính năng

- Live view of every LED on the strip, read from the device about 8 times per second.
  Xem trực tiếp màu từng bóng LED, đọc từ đèn khoảng 8 lần mỗi giây.
- Power, brightness, color, 145 effects, 72 palettes, speed and intensity.
  Bật/tắt, độ sáng, màu, 145 hiệu ứng, 72 bảng màu, tốc độ và cường độ.
- Load and save presets.
  Gọi và lưu preset.
- English and Vietnamese UI. The page follows the browser language, and the header switch changes it.
  Giao diện tiếng Anh và tiếng Việt. Trang theo ngôn ngữ trình duyệt, đổi được bằng nút ở đầu trang.

## Requirements / Yêu cầu

- Chrome or Edge on a desktop computer. Firefox, Safari and mobile browsers don't support Web Serial.
  Chrome hoặc Edge trên máy tính. Firefox, Safari và trình duyệt điện thoại không hỗ trợ Web Serial.
- The page must be served over HTTPS (GitHub Pages does this) or from `localhost`.
  Trang phải chạy qua HTTPS (GitHub Pages đã có sẵn) hoặc từ `localhost`.
- WLED firmware with serial at 115200 baud. Tested with WLED 16.0.1 on an ESP8266 LOLIN D1 mini (CH340).
  Firmware WLED, serial ở baud 115200. Đã thử với WLED 16.0.1 trên ESP8266 LOLIN D1 mini (CH340).

## Use / Sử dụng

1. Plug the light into USB. / Cắm đèn vào cổng USB.
2. Select **Connect light**, pick the CH340 port. Chrome remembers the permission.
   Bấm **Kết nối đèn**, chọn cổng CH340. Chrome sẽ nhớ quyền này.

Only one program can use the port at a time. Close `led.py`, the Arduino serial monitor, and similar tools first.
Mỗi lúc chỉ một chương trình dùng được cổng. Hãy đóng `led.py`, Serial Monitor của Arduino và các công cụ tương tự trước.

## Run locally / Chạy trên máy

```
python -m http.server 8765
```

Then open http://localhost:8765. There is no build step.
Sau đó mở http://localhost:8765. Không cần bước build.

## Note on DTR/RTS

On boards with an ESP auto-reset circuit (D1 mini, NodeMCU), changing DTR/RTS one signal at a time either resets the chip (RTS on, DTR off) or pulls GPIO0 low (DTR on, RTS off). WLED treats GPIO0 as its button, so that toggles the light. The page leaves both signals as Chrome opens them and never calls `setSignals()`.

Trên board có mạch auto-reset (D1 mini, NodeMCU), đổi DTR/RTS lần lượt từng tín hiệu sẽ gây ra một trong hai lỗi:
- RTS bật, DTR tắt: reset chip.
- DTR bật, RTS tắt: kéo GPIO0 xuống. WLED dùng GPIO0 làm nút bấm, nên đèn bị bật/tắt.

Vì vậy trang giữ nguyên hai tín hiệu như lúc Chrome mở cổng và không gọi `setSignals()`.

## Files

| File | |
|---|---|
| `index.html`, `style.css` | Page and styles |
| `app.js` | Web Serial connection, WLED JSON API, UI |
| `i18n.js` | English / Vietnamese strings |
| `wled-data.js` | Effect and palette names from WLED v16.0.1 source (ESP8266 build, 1D effects) |

Effect and palette names come from [WLED](https://github.com/wled/WLED) (EUPL-1.2).
