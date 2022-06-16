const redisconfig = require('./config')
const jobs = require('../../jobs/index')
const Queue = require('bull');

const queues = Object.values(jobs).map(job => ({
    bull: new Queue(job.key, redisconfig),
    name: job.key,
    handle: job.handle
}))

module.exports = {
    queues,
    add(name, data) {
        const queue = this.queues.find(queue => queue.name = name)
        return queue.bull.add(data, {
            removeOnComplete: true,
            removeOnFail: true
        })
    },
    process() {
        return this.queues.forEach(queue => {
            queue.bull.process(queue.handle)
            queue.bull.on('failed', (job, err) => {
                console.log('Job failed', queue.key, job.data)
                console.log(err)
            })
        })
    }
}