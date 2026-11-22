# WLED Web Serial

Control a [WLED](https://kno.wled.ge/) device over USB, right in your browser. The page uses the Web Serial API, so it needs no app, no server and no Wi-Fi connection to the device.

**Open it:** https://phuc4real.github.io/wled-web-serial/

*Tiếng Việt bên dưới.*

## Features

- Live preview of every LED, read from the device several times per second
- Power, brightness, color, effects, palettes, speed and intensity
- Apply and save presets
- English and Vietnamese interface

## Requirements

- Chrome or Edge 89 or later on a desktop computer. Firefox, Safari and mobile browsers don't support Web Serial.
- A WLED device connected over USB, with serial at the default 115200 baud.
- A common USB-serial chip: CH340/CH9102, CP210x, FTDI, PL2303, or the native USB on ESP32-S2/S3/C3/C6.

Tested with WLED 16.0.1 on an ESP8266 (LOLIN D1 mini).

## Usage

1. Connect the device to your computer over USB.
2. Select **Connect device** and choose its port. The browser remembers this permission for next time.

Only one app can use a serial port at a time. If connecting fails, close any serial monitor or other tool that has the port open.

## How it works

The page talks to WLED's built-in serial interface:

| Sent | Purpose |
|---|---|
| `{"v":true}` | Read the full state and device info (JSON) |
| `l` | Read the current color of every LED (JSON array) |
| `{"on":true,"bri":128,...}` | Change state, same format as WLED's JSON API |

### DTR/RTS and auto-reset boards

Many ESP boards (D1 mini, NodeMCU and similar) wire DTR and RTS to an auto-reset circuit. Changing these signals one at a time can:
- reset the chip (RTS on, DTR off), or
- pull GPIO0 low (DTR on, RTS off). WLED reads this as a button press and toggles the light.

The page keeps the signals exactly as the browser opens the port and never calls `setSignals()`.

## Run locally

Web Serial works on `localhost` without HTTPS. There is no build step:

```
python -m http.server 8000
```

Then open http://localhost:8000.

## Files

| File | Contents |
|---|---|
| `index.html`, `style.css` | Page structure and styles |
| `app.js` | Serial connection, WLED commands, interface logic |
| `i18n.js` | English and Vietnamese strings |
| `wled-data.js` | Effect and palette names from the WLED 16 source |

## Credits

Effect and palette names come from [WLED](https://github.com/wled/WLED) (EUPL-1.2). This is an independent project and is not affiliated with the WLED team.

---

## Tiếng Việt

Điều khiển thiết bị [WLED](https://kno.wled.ge/) qua cổng USB ngay trên trình duyệt. Trang dùng Web Serial API nên không cần cài ứng dụng, không cần server và không cần kết nối Wi-Fi tới thiết bị.

**Tính năng**
- Xem trước trực tiếp màu từng LED, đọc từ thiết bị nhiều lần mỗi giây.
- Bật/tắt, độ sáng, màu, hiệu ứng, bảng màu, tốc độ và cường độ.
- Áp dụng và lưu preset.
- Giao diện tiếng Anh và tiếng Việt.

**Yêu cầu**
- Chrome hoặc Edge phiên bản 89 trở lên trên máy tính. Firefox, Safari và trình duyệt di động không hỗ trợ Web Serial.
- Thiết bị WLED cắm qua USB, serial ở baud mặc định 115200.

**Sử dụng**
1. Cắm thiết bị vào máy tính qua USB.
2. Bấm **Kết nối thiết bị** và chọn cổng. Trình duyệt sẽ nhớ quyền này cho các lần sau.

Mỗi cổng serial chỉ một ứng dụng dùng được tại một thời điểm. Nếu không kết nối được, hãy đóng Serial Monitor hoặc công cụ khác đang mở cổng.
