handleError = (res) => {
    return new Promise((resolve) =>
        res.json().then(data => { console.log(data.errors); resolve(data); })
    )
}

const getProjectData = (callback) => {

    fetch('http://127.0.0.1:8000/projects/projectsdata')
        .then(function (response) {
            if (!response.ok) throw new Error('Invalid Response')
            console.log('success');
            return response.json();
        }).then(res => callback(res.result))
        .catch(err => { console.error('Error:', err); });

}

const addProjectdata = (data, callbacksuccess, callbackfail) => {
    const csrftoken = getCookie('csrftoken');
    const request = new Request(
        'http://127.0.0.1:8000/projects/projectsdata',
        { headers: { 'X-CSRFToken': csrftoken } }
    );
    fetch(request, {
        method: 'POST',
        mode: 'same-origin',  // Do not send CSRF token to another domain.
        body: data
    }).then(function (response) {
        if (!response.ok) return handleError(response);
        // throw new Error(response.json())
        console.log('success');
        return response.json();
    }).then(res => {
        if (res.errors) {
            throw new Error(res.errors)
        } else {
            callback(res.result)
        }
    }
    ).catch(err => {
        console.log(err);
        // errors = data.errors
    })

}
const deleteproject = () => { }