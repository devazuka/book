
import PocketBase from 'pocketbase'

export const client = new PocketBase("https://book.devazuka.com")




// parse the query parameters from the redirected url
// const { searchParams } = new URL(window.location.href)
// 
// // load the previously stored provider's data
// const cachedData = localStorage.getItem('provider')
// const provider = cachedData && JSON.parse(cachedData)

// compare the redirect's state param and the stored provider's one
// if (provider?.state !== searchParams.get("state")) {
//     throw "State parameters don't match."
// }

// // authenticate
// const contentElem = document.getElementById('content')
// try {
//     const authData = await client.users.authViaOAuth2(
//         provider.name,
//         searchParams.get("code"),
//         provider.codeVerifier,
//         'https://book.devazuka.com/redirect.html'
//     )
//     contentElem.textContent = JSON.stringify(authData, null, 2)
// } catch (err) {
//     // Should redirect to /index.html ?
//     contentElem.textContent = `Unable to redirect:\n${err.stack}`
// }
// console.log(authData)
