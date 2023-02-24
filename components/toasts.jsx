import cogoToast from 'cogo-toast'

let running = false

export const loadingToast = (msg) => {
	if (!running) {
		cogoToast.loading(msg, {
			hideAfter: 5,
		})
	}
}
