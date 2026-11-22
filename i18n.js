// Chuỗi giao diện tiếng Việt / English.
const STRINGS = {
  vi: {
    title: 'Đèn LED bàn',
    description: 'Điều khiển dải LED WLED qua cổng USB, ngay trong trình duyệt.',
    switchTo: 'English',
    switchLabel: 'Switch to English',
    statusIdle: 'Chưa kết nối',
    statusConnecting: 'Đang kết nối…',
    statusConnected: 'Đã kết nối',
    statusLost: 'Mất kết nối. Kiểm tra cáp USB rồi bấm Kết nối đèn.',
    statusChooserError: 'Không mở được hộp chọn cổng: {msg}',
    statusBusyTab: 'Cổng đang mở ở tab khác. Đóng tab đó rồi thử lại.',
    statusBusyPort: 'Không mở được cổng. Đóng led.py hoặc phần mềm khác đang dùng đèn rồi thử lại.',
    statusUnsupported: 'Không hỗ trợ Web Serial',
    statusPlugged: 'Đã cắm đèn. Bấm Kết nối đèn.',
    statusSaved: 'Đã lưu preset {id} ({name})',
    connect: 'Kết nối đèn',
    disconnect: 'Ngắt kết nối',
    captionIdle: 'Cắm đèn vào cổng USB rồi bấm Kết nối đèn.',
    captionReading: 'Đang đọc trạng thái đèn…',
    captionOn: '{n} bóng, hiệu ứng {fx}, khoảng {pwr} mA trên giới hạn {max} mA.',
    captionOff: '{n} bóng, đèn đang tắt.',
    stripOn: 'Dải LED {n} bóng đang sáng',
    stripOff: 'Dải LED đang tắt',
    unsupported: 'Trình duyệt này chưa hỗ trợ kết nối cổng USB (Web Serial). Hãy mở trang bằng Chrome hoặc Edge trên máy tính.',
    controls: 'Điều khiển đèn',
    turnOn: 'Bật đèn',
    turnOff: 'Tắt đèn',
    brightness: 'Độ sáng',
    color: 'Màu',
    pickColor: 'Chọn màu',
    hexLabel: 'Mã màu hex',
    hexHint: 'Dạng #rrggbb',
    quickColors: 'Màu nhanh',
    colorN: 'Màu {hex}',
    palette: 'Bảng màu cho hiệu ứng',
    effects: 'Hiệu ứng',
    fxSearch: 'Tìm hiệu ứng',
    fxPlaceholder: 'Tìm hiệu ứng, ví dụ: fire, rainbow',
    fxList: 'Danh sách hiệu ứng',
    fxEmpty: 'Không có hiệu ứng nào khớp. Thử từ khoá khác.',
    speed: 'Tốc độ',
    intensity: 'Cường độ',
    presets: 'Preset',
    presetGroup: 'Gọi preset',
    presetN: 'Gọi preset {i}',
    slotN: 'Preset {i}',
    saveInto: 'Lưu trạng thái hiện tại vào',
    name: 'Tên',
    namePlaceholder: 'Ví dụ: Làm việc',
    save: 'Lưu preset',
    footer: 'Trang này nói chuyện trực tiếp với đèn qua cổng USB (Web Serial), chạy hoàn toàn trong trình duyệt và không gửi dữ liệu đi đâu. Đèn chạy firmware <a href="https://kno.wled.ge/" rel="noopener">WLED</a>.',
    devInfo: 'WLED {ver} ({rel}), đã chạy {up}.',
    uptimeH: '{h} giờ {m} phút',
    uptimeM: '{m} phút',
  },
  en: {
    title: 'Desk LED',
    description: 'Control a WLED light strip over USB, right in your browser.',
    switchTo: 'Tiếng Việt',
    switchLabel: 'Chuyển sang tiếng Việt',
    statusIdle: 'Not connected',
    statusConnecting: 'Connecting…',
    statusConnected: 'Connected',
    statusLost: 'Connection lost. Check the USB cable, then select Connect light.',
    statusChooserError: 'Could not open the port picker: {msg}',
    statusBusyTab: 'The port is open in another tab. Close that tab and try again.',
    statusBusyPort: 'Could not open the port. Close led.py or any other app using the light, then try again.',
    statusUnsupported: 'Web Serial not supported',
    statusPlugged: 'Light plugged in. Select Connect light.',
    statusSaved: 'Saved preset {id} ({name})',
    connect: 'Connect light',
    disconnect: 'Disconnect',
    captionIdle: 'Plug the light into a USB port, then select Connect light.',
    captionReading: 'Reading the light’s state…',
    captionOn: '{n} LEDs, {fx} effect, about {pwr} mA of the {max} mA limit.',
    captionOff: '{n} LEDs, the light is off.',
    stripOn: 'LED strip with {n} lit LEDs',
    stripOff: 'LED strip is off',
    unsupported: 'This browser can’t connect to USB serial ports (Web Serial). Open this page in Chrome or Edge on a computer.',
    controls: 'Light controls',
    turnOn: 'Turn on',
    turnOff: 'Turn off',
    brightness: 'Brightness',
    color: 'Color',
    pickColor: 'Pick a color',
    hexLabel: 'Hex color code',
    hexHint: 'Format #rrggbb',
    quickColors: 'Quick colors',
    colorN: 'Color {hex}',
    palette: 'Palette for effects',
    effects: 'Effects',
    fxSearch: 'Search effects',
    fxPlaceholder: 'Search effects, e.g. fire, rainbow',
    fxList: 'Effect list',
    fxEmpty: 'No effects match. Try another word.',
    speed: 'Speed',
    intensity: 'Intensity',
    presets: 'Presets',
    presetGroup: 'Load a preset',
    presetN: 'Load preset {i}',
    slotN: 'Preset {i}',
    saveInto: 'Save the current state to',
    name: 'Name',
    namePlaceholder: 'For example: Work',
    save: 'Save preset',
    footer: 'This page talks to the light directly over USB (Web Serial). It runs entirely in your browser and sends no data anywhere. The light runs <a href="https://kno.wled.ge/" rel="noopener">WLED</a> firmware.',
    devInfo: 'WLED {ver} ({rel}), running for {up}.',
    uptimeH: '{h} h {m} min',
    uptimeM: '{m} min',
  },
};

const KEY = 'led-lang';
function initialLang() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved in STRINGS) return saved;
  } catch { /* bỏ qua */ }
  return (navigator.language || '').toLowerCase().startsWith('vi') ? 'vi' : 'en';
}

let lang = initialLang();
export const getLang = () => lang;

export function t(key, vars = {}) {
  const s = STRINGS[lang][key] ?? STRINGS.vi[key] ?? key;
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));
}

// Áp chuỗi tĩnh: data-i18n (text), data-i18n-html, data-i18n-attr="attr:key;attr:key"
export function applyStatic(root = document) {
  document.documentElement.lang = lang;
  document.title = t('title');
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('description'));
  root.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  root.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
  root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split(';').forEach((pair) => {
      const [attr, key] = pair.split(':');
      el.setAttribute(attr, t(key));
    });
  });
}

export function toggleLang() {
  lang = lang === 'vi' ? 'en' : 'vi';
  try { localStorage.setItem(KEY, lang); } catch { /* bỏ qua */ }
  return lang;
}
