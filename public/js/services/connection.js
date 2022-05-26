const host = window.location.host;
const split = document.URL.split("/")
const protocol = split[0]

const noBody = async (url, method) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    try {
        const result = await fetch(`${protocol}//${host}/${url}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })

        if (result.ok) {
            return result.json()
        } else {
            if (result.status === 401) {
                const valid = await refresh()

                if (valid === true) {
                    try {
                        const newAccessToken = JSON.parse(localStorage.getItem('accessToken'))

                        const newresult = await fetch(`${protocol}//${host}/${url}`, {
                            method: method,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${newAccessToken}`
                            }
                        })

                        if (newresult.ok) {
                            return newresult.json()
                        } else {
                            alert('Error del Servidor.')
                            return result.json()
                        }
                    } catch (error) {
                        throw new Error(error)
                    }
                } else {
                    return false
                }
            }

            if (result.status === 404) {
                alert('No se ha encontrado.')
                return result.json()
            }

            if (result.status === 500) {
                alert('Error del Servidor.')
                return result.json()
            }
        }

    } catch (error) {
        return error
    }
}

const body = async (url, data, method) => {

    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    try {
        const result = await fetch(`${protocol}//${host}/${url}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(data)
        })

        if (result.ok) {
            return result.json()
        } else {
            if (result.status === 401) {
                const valid = await refresh()

                if (valid === true) {
                    try {
                        const newAccessToken = JSON.parse(localStorage.getItem('accessToken'))

                        const newresult = await fetch(`${protocol}//${host}/${url}`, {
                            method: method,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${newAccessToken}`
                            },
                            body: JSON.stringify(data)
                        })

                        if (newresult.ok) {
                            return newresult.json()
                        } else {
                            return result.json()
                        }
                    } catch (error) {
                        throw new Error(error)
                    }
                } else {
                    return false
                }
            }

            if (result.status === 404) {
                alert('No se ha encontrado.')
                return result.json()
            }

            if (result.status === 500) {
                alert('Error del Servidor.')
                return result.json()
            }
        }
    } catch (error) {
        return error
    }
}

const bodyMultipart = async (url, data, method) => {

    const accessToken = JSON.parse(localStorage.getItem('accessToken'))

    try {
        const result = await fetch(`${protocol}//${host}/${url}`, {
            method: method,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            body: data
        })

        if (result.ok) {
            return result.json()
        } else {
            if (result.status === 401) {
                const valid = await refresh()

                if (valid === true) {
                    try {
                        const newAccessToken = JSON.parse(localStorage.getItem('accessToken'))

                        const newresult = await fetch(`${protocol}//${host}/${url}`, {
                            method: method,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${newAccessToken}`
                            },
                            body: data
                        })

                        if (newresult.ok) {
                            return newresult.json()
                        } else {
                            alert('Error del Servidor.')
                            return result.json()
                        }
                    } catch (error) {
                        throw new Error(error)
                    }
                } else {
                    return false
                }
            }

            if (result.status === 404) {
                alert('No se ha encontrado.')
                return result.json()
            }

            if (result.status === 500) {
                alert('Error del Servidor.')
                return result.json()
            }
        }
    } catch (error) {
        return error
    }
}


const noBearer = async (url, data, method) => {
    const result = await fetch(`${protocol}//${host}/${url}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if (result.ok) {
        return result.json()
    }

    throw new Error('¡Nombre de usuario y / o contraseña inválido!')
}


const refresh = async () => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'))
    const refreshToken = JSON.parse(localStorage.getItem('refreshToken'))

    const data = await fetch(`${protocol}//${host}/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            refreshToken: refreshToken,
            accessToken: accessToken
        })
    })

    if (data.status === 401) {
        sessionStorage.clear()
        localStorage.clear()

        window.location.href = '../public/login.html'

        alert('¡Su sesión ha sido cancelada por inactividad!')
    }

    if (data.ok) {
        const token = await data.json()

        localStorage.setItem('accessToken', JSON.stringify(token.accessToken))
        localStorage.setItem('refreshToken', JSON.stringify(token.refreshToken))

        return true
    }

    throw new Error('error')
}

const backFile = async (url, data, method) => {
    
    try {
        const result = await fetch(`${protocol}//${host}/${url}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (result.ok) {
            return result
        } else {
            if (result.status === 401) {
                const valid = await refresh()

                if (valid === true) {
                    try {
                        const newAccessToken = JSON.parse(localStorage.getItem('accessToken'))

                        const newresult = await fetch(`${protocol}//${host}/${url}`, {
                            method: method,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${newAccessToken}`
                            }
                        })

                        if (newresult.ok) {
                            return newresult
                        } else {
                            alert('Error del Servidor.')
                            return result
                        }
                    } catch (error) {
                        throw new Error(error)
                    }
                } else {
                    return false
                }
            }

            if (result.status === 404) {
                alert('No se ha encontrado.')
                return result.json()
            }

            if (result.status === 500) {
                alert('Error del Servidor.')
                return result.json()
            }
        }

    } catch (error) {
        return error
    }
}

const backGetFile = async (url, method) => {
    
    try {
        const result = await fetch(`${protocol}//${host}/${url}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (result.ok) {
            return result
        } else {
            if (result.status === 401) {
                const valid = await refresh()

                if (valid === true) {
                    try {
                        const newAccessToken = JSON.parse(localStorage.getItem('accessToken'))

                        const newresult = await fetch(`${protocol}//${host}/${url}`, {
                            method: method,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${newAccessToken}`
                            }
                        })

                        if (newresult.ok) {
                            return newresult
                        } else {
                            alert('Error del Servidor.')
                            return result
                        }
                    } catch (error) {
                        throw new Error(error)
                    }
                } else {
                    return false
                }
            }

            if (result.status === 404) {
                alert('No se ha encontrado.')
                return result.json()
            }

            if (result.status === 500) {
                alert('Error del Servidor.')
                return result.json()
            }
        }

    } catch (error) {
        return error
    }
}


export const Connection = {
    noBody,
    body,
    noBearer,
    refresh,
    bodyMultipart,
    backFile,
    backGetFile
}


