// //<link rel='stylesheet' href='https://use.fontawesome.com/releases/v5.0.13/css/all.css'></link>

// let tempdiv = '<td>' + obj.id + '</td><td><span class="agentName " id="agentId-' + obj.id + '">' + obj.name + '</span></td>';
// $("<tr />", { "class": "agentsListRow" }).append(tempdiv).appendTo('#agentTable');

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function editUser(data,callback) {
    const csrftoken = getCookie('csrftoken');
    const request = new Request(
        'http://127.0.0.1:8000/accounts/edituser',
        { headers: { 'X-CSRFToken': csrftoken } }
    );
    fetch(request, {
        method: 'POST',
        mode: 'same-origin',  // Do not send CSRF token to another domain.
        body: JSON.stringify(data)
    }).then(function (response) {
        if(!response.ok) throw new Error('Invalid Response')
        console.log('success');
        return response.json();
    }).then(res => callback(res))
    .catch(err=> {console.error('Error:', err);});
}

function postUser(data,callback) {
    const csrftoken = getCookie('csrftoken');
    const request = new Request(
        'http://127.0.0.1:8000/accounts/postuser',
        { headers: { 'X-CSRFToken': csrftoken } }
    );
    fetch(request, {
        method: 'POST',
        mode: 'same-origin',  // Do not send CSRF token to another domain.
        body: JSON.stringify(data)
    }).then(function (response) {
        if(!response.ok) throw new Error('Invalid Response')
        console.log('success');
        return response.json();
    }).then(res => callback(res))
    .catch(err=> {console.error('Error:', err);});
}

function deleteUser(data,callback) {
    const csrftoken = getCookie('csrftoken');
    const request = new Request(
        'http://127.0.0.1:8000/accounts/deleteuser',
        { headers: { 'X-CSRFToken': csrftoken } }
    );
    fetch(request, {
        method: 'POST',
        mode: 'same-origin',  // Do not send CSRF token to another domain.
        body: JSON.stringify(data)
    }).then(function (response) {
        if(!response.ok) throw new Error('Invalid Response')
        console.log('success');
        return response.json();
    }).then(res => callback(res))
    .catch(err=> {console.error('Error:', err);});
}
function getUsers(callback) {
      
    fetch('http://127.0.0.1:8000/accounts/userjson')
    .then(function (response) {
        if(!response.ok) throw new Error('Invalid Response')
        console.log('success');
        return response.json();
    }).then(res => callback(res))
    .catch(err=> {console.error('Error:', err);});
}
function renderUser(res){
    $('#userTable').empty();
    res.map(obj=>{
        let tempdiv = `<td>${obj.id}</td><td>${obj.igene_id}</td><td>${obj.email}</td><td>${obj.username}</td><td>${obj.dept?obj.dept:''}</td><td>${obj.designation?obj.designation:''}</td><td>${obj.doj?obj.doj:''}</td><td>${obj.usertype}</td><td><a href="#editEmployeeModal" class="edit" data-toggle="modal" data-target="#editEmployeeModal"><i class="fas fa-user-edit"></i></a>
        <a href="#deleteEmployeeModal" class="delete" data-toggle="modal" data-target="#deleteEmployeeModal"><i class="fas fa-user-minus"></i></a></td>`;
        
        $("<tr />", { "class": "usersListRow","id":obj.id,"data-userid":obj.id }).append(tempdiv).appendTo('#userTable');
    })
}
function getUser(user,callback){
    const csrftoken = getCookie('csrftoken');
    const request = new Request(
        'http://127.0.0.1:8000/accounts/getuser',
        { headers: { 'X-CSRFToken': csrftoken } }
    );
    fetch(request,{
        method: 'POST',
        mode: 'same-origin',  // Do not send CSRF token to another domain.
        body: JSON.stringify({'userid':user})
    }).then(response => {
        if(!response.ok) throw new Error('Invalid Input Response')
        return response.json();
    }).then( (res)=>{
        callback(res);
    }).catch(err=> {console.error('Error:', err);});
}

function getUserList(){
    fetch('http://127.0.0.1:8000/accounts/userjson').then(response => response.json()).then(function (res){
        console.log(res);
    });
}

$(document).ready(() => {
    getUsers(renderUser);
    $('#addUser').click(function () {
        let data = {};
        let passwords = $('#userdetails :input[type=password]');
        if ($(passwords[0]).val() !== $(passwords[1]).val()) {
            alert('password must be equal');
            return;
        }

        let text_inputs = $('#userdetails :input');
        text_inputs.each(function () {
            data[this.name] = $(this).val();
        });
        // let selec_inputs = $('#userdetails :select')
        // selec_inputs.each(function () {
        //     data[this.name] = $(this).val();
        // });
        console.log(data);
        let { password2, ...userdata } = data;
        postUser(userdata,(data)=>{
             renderUser(data);
             alert('Added User');
             $('#userdetails')[0].reset();
        });

    });
    $('#editEmployeeModal').on('show.bs.modal', function (event) {
        let row = $(event.relatedTarget).parent().parent();
         
        console.log(row.data('userid'));
        $('<input>').attr({
            type: 'hidden',
            id:'hiddenuseridedit',
            value:row.data('userid')
        }).appendTo('#editEmployeeModal .modal-body');
        
        getUser(row.data('userid'),(data)=>{
            let text_inputs = $('#edituserdetails :input[type]');
            text_inputs.each(function () {
                if (this.name in data) {
                    let foundData = data[this.name];
                    $(this).val(foundData);
                }
            });
            let select=$('#edituserdetails select')[0];
            if(select.name in data) {
                console.log(data[select.name]);
                $('#edituserdetails select option').each(function (){
                    if(this.text === data[select.name]){
                       
                        $(select).val($(this).attr('value'));
                    }
                }

                );
            }

        })
        // Button that triggered the modal
        // var recipient = button.data('whatever') // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
       
      })
      $('#deleteEmployeeModal').on('show.bs.modal', function (event) {
        let row = $(event.relatedTarget).parent().parent();
         
        console.log(row.data('userid'));
        
        $('<input>').attr({
            type: 'hidden',
            id:'hiddenuserid',
            value:row.data('userid')
        }).appendTo('#deleteEmployeeModal .modal-body');
              
      })
      $('#deletebutton').on('click',function(event){
         let userId=$('#hiddenuserid').val();
         $('#hiddenuserid').remove();
         deleteUser({'userid':userId},renderUser)
         $('#deleteEmployeeModal').modal('hide')
         
      })
      $('#editUserbutton').on('click',function(event){
        let userId=$('#hiddenuseridedit').val();
        let data = {};
        data['userid']=userId;
        let text_inputs = $('#edituserdetails :input');
        text_inputs.each(function () {
            data[this.name] = $(this).val();
        });
        $('#hiddenuseridedit').remove();
        editUser(data,renderUser);
        $('#editEmployeeModal').modal('hide')

       //  deleteUser({'userid':userId})
        
     })
      

});