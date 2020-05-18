import startup from './startup'

export default async function () {
  const { atomPubRequest } = await startup()
  console.log(`Try connection to Hatena-blog AtomPub API server with credentials...`)
  await atomPubRequest.fetchServiceDocuments()
    .catch( e => {
      console.error(`Connection is failed\nmessage: ${e.message}`)
      process.exit(-1)
    })

  console.log('Success!!')
}
