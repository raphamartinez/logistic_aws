
module.exports = {
    key: 'teste',
    async handle(job, done) {
        if (!job.data) return done()
        const { carLocation, groupId } = job.data
        try {
            await require('../models/driveup').queueResponses(carLocation, groupId)
            done()
        } catch (error) {
            done(new Error(error))
        }
    }
}