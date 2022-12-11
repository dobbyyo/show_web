// eslint-disable-next-line default-param-last
const useConfirm = (message = '', onConfirm: () => void, onCancel: () => void) => {
  if (!onConfirm && typeof onConfirm !== 'function') {
    return;
  }
  if (!onCancel && typeof onCancel !== 'function') {
    return;
  }
  const confirmAction = () => {
    if (window.confirm(message)) {
      onConfirm();
    } else {
      onCancel();
    }
  };
  // eslint-disable-next-line consistent-return
  return confirmAction;
};

export default useConfirm;
