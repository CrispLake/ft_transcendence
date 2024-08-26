export class Timer {
	constructor() {
		this.startTime = null;
		this.duration = null;
		this.timerId = null;
	}

	start(seconds) {
		this.duration = seconds;
		this.startTime = Date.now();
		if (this.timerId) {
			clearInterval(this.timerId);
		}
		this.timerId = setInterval(() => {
			const remainingTime = this.getRemainingTime();
			if (remainingTime <= 0) {
				clearInterval(this.timerId);
				this.timerId = null;
			}
		}, 1000);
	}

	getRemainingTime() {
		if (!this.startTime || !this.duration) {
			return 0;
		}
		const elapsedTime = (Date.now() - this.startTime) / 1000;
		const remainingTime = this.duration - elapsedTime;
		return Math.max(remainingTime, 0);
	}

	toString() {
		let minutes = 0;
		let seconds = 0;
		let totalSeconds = 0;

		totalSeconds = Math.floor(this.getRemainingTime());
		minutes = Math.floor(totalSeconds / 60);
		seconds = totalSeconds % 60;
		if (minutes > 0) {
			if (seconds < 10) {
				return (minutes.toString() + ":0" + seconds.toString());
			}
			return (minutes.toString() + ":" + seconds.toString());
		}
		else {
			return (seconds.toString());
		}
	}
}
