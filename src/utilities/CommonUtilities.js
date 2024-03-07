export const getCookie = (name) => {
    let cookies = document.cookie.split(';')
    
    for(let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim()
        
        if(cookie.indexOf(name + '=') === 0) {
            return cookie.substring(name.length + 1)
        }
    }
    
    return null
}