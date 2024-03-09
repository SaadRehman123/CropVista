export const getInitials = (name) => {
    const words = name.split(/\s+/);
    const initials = words.filter(word => word.trim() !== "").map((word, index) => (index === 0 || index === words.length - 1) ? word[0] : '').join("")
    return initials.toUpperCase();
}

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