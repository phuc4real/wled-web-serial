// UI strings: Tiếng Việt / English.
const REPO = 'https://github.com/phuc4real/wled-web-serial';

const STRINGS = {
  vi: {
    title: 'WLED Web Serial',
    description: 'Điều khiển thiết bị WLED qua cổng USB ngay trên trình duyệt bằng Web Serial.',
    switchTo: 'English',
    switchLabel: 'Switch to English',
    statusIdle: 'Chưa kết nối',
    statusConnecting: 'Đang kết nối…',
    statusConnected: 'Đã kết nối',
    statusLost: 'Mất kết nối với thiết bị. Kiểm tra cáp USB rồi kết nối lại.',
    statusChooserError: 'Không mở được hộp thoại chọn cổng: {msg}',
    statusBusyTab: 'Cổng đang được mở ở một tab khác. Hãy đóng tab đó rồi thử lại.',
    statusBusyPort: 'Không mở được cổng. Hãy đóng ứng dụng khác đang dùng cổng này (ví dụ Serial Monitor) rồi thử lại.',
    statusUnsupported: 'Trình duyệt không hỗ trợ',
    statusPlugged: 'Đã phát hiện thiết bị. Bấm Kết nối thiết bị.',
    statusSaved: 'Đã lưu preset {id}: {name}',
    connect: 'Kết nối thiết bị',
    disconnect: 'Ngắt kết nối',
    captionIdle: 'Cắm thiết bị WLED vào cổng USB rồi bấm Kết nối thiết bị.',
    captionReading: 'Đang đọc trạng thái thiết bị…',
    captionOn: '{n} LED, hiệu ứng {fx}. Dòng ước tính {pwr} mA (giới hạn {max} mA).',
    captionOff: '{n} LED, đang tắt.',
    stripOn: 'Xem trước dải {n} LED',
    stripOff: 'Dải LED đang tắt',
    unsupported: 'Trình duyệt này không hỗ trợ Web Serial. Hãy dùng Chrome hoặc Edge phiên bản 89 trở lên trên máy tính.',
    controls: 'Điều khiển',
    turnOn: 'Bật',
    turnOff: 'Tắt',
    brightness: 'Độ sáng',
    color: 'Màu',
    pickColor: 'Chọn màu',
    hexLabel: 'Mã màu hex',
    hexHint: 'Định dạng #rrggbb',
    quickColors: 'Màu có sẵn',
    colorN: 'Màu {hex}',
    palette: 'Bảng màu cho hiệu ứng',
    effects: 'Hiệu ứng',
    fxSearch: 'Tìm hiệu ứng',
    fxPlaceholder: 'Tìm theo tên hoặc số, ví dụ: fire',
    fxList: 'Danh sách hiệu ứng',
    fxEmpty: 'Không có hiệu ứng nào khớp. Thử từ khoá khác.',
    speed: 'Tốc độ',
    intensity: 'Cường độ',
    presets: 'Preset',
    presetGroup: 'Áp dụng preset',
    presetN: 'Áp dụng preset {i}',
    slotN: 'Preset {i}',
    saveInto: 'Lưu trạng thái hiện tại vào',
    name: 'Tên',
    namePlaceholder: 'Ví dụ: Buổi tối',
    save: 'Lưu preset',
    footer: `Kết nối trực tiếp với thiết bị qua Web Serial. Mọi xử lý diễn ra trong trình duyệt, không có dữ liệu nào được gửi ra ngoài. Danh sách hiệu ứng và bảng màu theo <a href="https://kno.wled.ge/" rel="noopener">WLED</a> 16. Dự án độc lập, không thuộc nhóm phát triển WLED. <a href="${REPO}" rel="noopener">Mã nguồn trên GitHub</a>.`,
    devInfo: 'WLED {ver} ({rel}), thời gian chạy {up}.',
    uptimeH: '{h} giờ {m} phút',
    uptimeM: '{m} phút',
  },
  en: {
    title: 'WLED Web Serial',
    description: 'Control a WLED device over USB, right in your browser, using Web Serial.',
    switchTo: 'Tiếng Việt',
    switchLabel: 'Chuyển sang tiếng Việt',
    statusIdle: 'Not connected',
    statusConnecting: 'Connecting…',
    statusConnected: 'Connected',
    statusLost: 'Lost connection to the device. Check the USB cable and connect again.',
    statusChooserError: 'Couldn’t open the port picker: {msg}',
    statusBusyTab: 'The port is open in another tab. Close that tab and try again.',
    statusBusyPort: 'Couldn’t open the port. Close any other app using it (such as a serial monitor) and try again.',
    statusUnsupported: 'Browser not supported',
    statusPlugged: 'Device detected. Select Connect device.',
    statusSaved: 'Saved preset {id}: {name}',
    connect: 'Connect device',
    disconnect: 'Disconnect',
    captionIdle: 'Plug in your WLED device over USB, then select Connect device.',
    captionReading: 'Reading device state…',
    captionOn: '{n} LEDs, effect {fx}. Estimated current {pwr} mA (limit {max} mA).',
    captionOff: '{n} LEDs, off.',
    stripOn: 'Preview of {n} LEDs',
    stripOff: 'LED strip is off',
    unsupported: 'This browser doesn’t support Web Serial. Use Chrome or Edge 89 or later on a desktop computer.',
    controls: 'Controls',
    turnOn: 'Turn on',
    turnOff: 'Turn off',
    brightness: 'Brightness',
    color: 'Color',
    pickColor: 'Pick a color',
    hexLabel: 'Hex color code',
    hexHint: 'Format #rrggbb',
    quickColors: 'Preset colors',
    colorN: 'Color {hex}',
    palette: 'Palette for effects',
    effects: 'Effects',
    fxSearch: 'Search effects',
    fxPlaceholder: 'Search by name or number, e.g. fire',
    fxList: 'Effect list',
    fxEmpty: 'No effects match. Try another search.',
    speed: 'Speed',
    intensity: 'Intensity',
    presets: 'Presets',
    presetGroup: 'Apply a preset',
    presetN: 'Apply preset {i}',
    slotN: 'Preset {i}',
    saveInto: 'Save current state to',
    name: 'Name',
    namePlaceholder: 'For example: Evening',
    save: 'Save preset',
    footer: `Connects directly to your device over Web Serial. Everything runs in your browser and no data leaves your computer. Effect and palette lists match <a href="https://kno.wled.ge/" rel="noopener">WLED</a> 16. Independent project, not affiliated with WLED. <a href="${REPO}" rel="noopener">Source on GitHub</a>.`,
    devInfo: 'WLED {ver} ({rel}), up {up}.',
    uptimeH: '{h} h {m} min',
    uptimeM: '{m} min',
  },
};

const KEY = 'wled-web-serial-lang';
function initialLang() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved in STRINGS) return saved;
  } catch { /* storage unavailable */ }
  return (navigator.language || '').toLowerCase().startsWith('vi') ? 'vi' : 'en';
}

let lang = initialLang();
export const getLang = () => lang;

export function t(key, vars = {}) {
  const s = STRINGS[lang][key] ?? STRINGS.en[key] ?? key;
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));
}

// Static strings: data-i18n (text), data-i18n-html, data-i18n-attr="attr:key;attr:key"
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
  try { localStorage.setItem(KEY, lang); } catch { /* storage unavailable */ }
  return lang;
}
