export const glSystem = {
  _busy: false,
  _busy_timer: 0,
  set busy (v) {
    if (v) {
      glSystem._busy = true
      clearTimeout(glSystem._busy_timer)
      glSystem._busy_timer = setTimeout(() => {
        glSystem._busy = false
      }, 100)
    } else {
      glSystem._busy = false
    }
  },

  get isBusy () {
    return glSystem._busy
  }
}
