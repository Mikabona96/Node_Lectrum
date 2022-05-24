class TimersManager {
    constructor() {
        this.timers = [];
        this.timersId = [];
        this.paused = [];
    }
    add(timer, ...args) {
        if (!timer) return undefined
        if (timer.job.length === 0) {
            this.timers.push(timer)
        } else {
            const boundedJob = timer.job.bind(timer, ...args)
            timer.job = boundedJob
            this.timers.push(timer)
        }
        return this
    }
    remove(timer) {
        for (let i = 0; i < this.timersId.length; i++) {
            if (timer.name === this.timersId[i].name) {
                if (this.timersId[i].intervalId) {
                    clearInterval(this.timersId[i].intervalId)
                }
                clearTimeout(this.timersId[i].timerId)
                const idx = this.timers.indexOf(timer)
                this.timers.splice(idx, 1)

                let idx2
                this.timersId.forEach((t, i) => {
                    if (t.name === timer.name) {
                        idx2 = i
                    }
                })
                this.timersId.splice(idx2, 1)

                return this.timers
            }
        }
    }
    start() {
        this.timers.forEach(timer => {
            if (timer.interval == true) {
                const intervalId = setInterval(() => {
                    timer.job()
                }, timer.delay)
                this.timersId.push({
                    name: timer.name,
                    intervalId
                })
            }

            const timerId = setTimeout(() => {
                timer.job()
            }, timer.delay)

            this.timersId.push({
                name: timer.name,
                timerId
            })
        })
    }
    stop() {
        for (let i = 0; i < this.timersId.length; i++) {
            if (this.timersId[i].intervalId) {
                clearInterval(this.timersId[i].intervalId)
            }

            clearTimeout(this.timersId[i].timerId)
        }
        this.timersId.splice(0, this.timersId.length -1)
    }
    pause(timer) {
        if (!timer) return false
        this.paused.push(timer)
        this.remove(timer)
        return true
    }
    resume(timer) {
        this.paused.forEach(t => {
            if (t.name === timer.name) {
                if (timer.interval == true) {
                    const intervalId = setInterval(() => {
                        timer.job()
                    }, timer.delay)
                    this.timersId.push({
                        name: timer.name,
                        intervalId
                    })
                }
    
                const timerId = setTimeout(() => {
                    timer.job()
                }, timer.delay)
    
                this.timersId.push({
                    name: timer.name,
                    timerId
                })
            }
        })
    }
}

const manager = new TimersManager();

const t1 = {
    name: 't1',
    delay: 1000,
    interval: false,
    job: () => { console.log('t1') }
};

const t3 = {
    name: 't3',
    delay: 1000,
    interval: true,
    job: () => { console.log('t3') }
};

const t4 = {
    name: 't4',
    delay: 1000,
    interval: true,
    job: () => { console.log('t4') }
};

const t2 = {
    name: 't2',
    delay: 1000,
    interval: false,
    job: (a, b) => a + b
};

manager.add(t1);
manager.add(t3);
manager.add(t4);
manager.add(t2, 1, 2);
manager.start();
console.log('length', manager.timersId.length)
setTimeout(() => manager.remove(t3), 4000)
setTimeout(() => manager.pause(t4), 5000)
setTimeout(() => manager.resume(t4), 7000)
setTimeout(() => {
    console.log('length', manager.timersId.length)
}, 6000)
// console.log(1);
// manager.pause('t1');

