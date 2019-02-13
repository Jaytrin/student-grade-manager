/* information about jsdocs: 
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
* 
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);

/**
 * Define all global variables here.  
 */
var student_array = [];

/***********************
 * student_array - global array to hold student objects
 * @type {Array}
 * example of student_array after input: 
 * student_array = [
 *  { name: 'Jake', course: 'Math', grade: 85 },
 *  { name: 'Jill', course: 'Comp Sci', grade: 85 }
 * ];
 */

/***************************************************************************************************
* initializeApp 
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions
*/
function initializeApp(){
    addClickHandlersToElements();
}


/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined}
* @returns  {undefined}
*
*/
function addClickHandlersToElements(){
    $('#submitData').on('click',handleSubmitClicked);
    $('#cancel').on('click',handleCancelClick);
    $('#getData').on('click',handleGetDataClick);
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */
function handleSubmitClicked(){
    submitData();
}
/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick(){
    clearAddStudentFormInputs();
    changeSubmitButton();
    clearInputWarning();
}

 /***************************************************************************************************
 * updateStudentObject - updates the student Object based on current values on form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls:
 */
function updateStudentObject(){
    var student = $('#studentName').val();
    var course = $('#course').val();
    var grade = $('#studentGrade').val();

    var studentObject = {
        student: student,
        course: course,
        grade: grade
    };
    return studentObject;
}

/***************************************************************************************************
 * submitData - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
function submitData(){
    var studentObject = updateStudentObject();
    var inputsValid = checkCharacters();

    if(inputsValid){
    $.ajax({
        type:'POST',
        url: 'http://localhost:8888/app.php/?request=submit_data',
        data: {
            student: studentObject.student,
            course: studentObject.course,
            grade: studentObject.grade
        },
        dataType: 'json',
        success: messageSent()
    }).then(()=>{
        clearAddStudentFormInputs();
        getData();
        clearInputWarning();
        });
    }
}
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs(){
    $('#studentName').val("");
    $('#course').val("");
    $('#studentGrade').val("");
}
/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom(studentObj){
    var studentNameElement = $('<td>').text(studentObj.student).addClass('align-middle');
    var studentCourseElement = $('<td>').text(studentObj.course).addClass('align-middle');
    var studentGradeElement = $('<td>').text(studentObj.grade).addClass('align-middle');
    var studentID = studentObj.ID;

    var deleteButton = $('<i>').addClass('fas fa-trash-alt ml-2 deleteBtn');
    var editButton = $('<i>').addClass('fas fa-edit mr-2 editBtn');

    var buttonTD = $('<td>').append(editButton, deleteButton).addClass('align-middle');

    var newStudentData = $('<tr>').addClass('text-center').append(studentNameElement, studentCourseElement, studentGradeElement, buttonTD).attr('id',studentID);;

    $('.student-list tbody').append(newStudentData);

    updateClickHandlers();
    highlightSection();
}

/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList(students){
    $('.student-list tbody').empty();
    for(var i = 0; i < students.length; i++){
        renderStudentOnDom(students[i]);
    }
    renderGradeAverage(calculateGradeAverage(students));
}
/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage(array){
    var studentGradeSum = 0;
    for (var studentIndex = 0; studentIndex < array.length; studentIndex++){
        studentGradeSum = parseInt(studentGradeSum) + parseInt(array[studentIndex].grade);
    }
    var result = studentGradeSum / array.length;
    return result;
}
/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderGradeAverage(average){
    var roundedAverage = Math.round(average);
    $('.avgGrade.label.label-default').text(roundedAverage);
}
/***************************************************************************************************
 * handleGetDataClick - Event Handler when user clicks the get data button, should pull records from DB
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: getData
 */

function handleGetDataClick(){
    getData();
}

/***************************************************************************************************
 * getData - Functino that gets data from the database
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: updateStudentList
 */
function getData(){
    student_array = [];
    var ajaxConfig = {
        dataType: 'json',
        url: 'http://localhost:8888/app.php/?request=get_data',
        method: 'get',
        success:
            function(returnedObject) {
            for (var i = 0; i < returnedObject.length; i++) {
                var student_object = {
                    ID: returnedObject[i].ID,
                    student: returnedObject[i].student,
                    course: returnedObject[i].course,
                    grade: returnedObject[i].grade
                };
                student_array.push(student_object);
            }
            updateStudentList(student_array);
        }}

    $.ajax(ajaxConfig);
    }

/***************************************************************************************************
 * messageSent - confirms a successful submission of student data.
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls:
 */

 function messageSent(){
     clearAddStudentFormInputs();
 }

 /***************************************************************************************************
 * highlightSection - Clears all previous highlights and highlights current section
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls:
 */
 function highlightSection(){
    $('tr').off();
    $('tr').on('click',function(){
        var highlighted = $(this).hasClass("highlight");
        var mainHeader = $(this).hasClass("main-headers");
        $('tr').removeClass("highlight");
        if(!mainHeader && !highlighted){
            $(this).addClass("highlight");
            }
    });
}

 /***************************************************************************************************
 * updateClickHandlers - Updates click hanlders
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: changeUpdateButton
 */

function updateClickHandlers(){
    $('.deleteBtn').off();
    $('.editBtn').off();
    $('.deleteBtn').on('click',function(event){
        var studentID = getStudentID(event.target);
        $('#deleteModal').modal();
        $('#confirmDelete').off();
        $('#confirmDelete').click('on',()=>{
            $.ajax({
                type:'POST',
                url: 'http://localhost:8888/app.php/?request=delete_data',
                data: {
                   ID:studentID
                },
                dataType: 'json'
            }).then(()=>{
                getData();
                clearAddStudentFormInputs();
                clearInputWarning();
            });
            $('#deleteModal').modal('hide')
        })
    });

    $('.editBtn').on('click',function(event){
        displayEditing();
        window.scrollTo(0, 0);
        var studentID = getStudentID(event.target);
        var student = $('#' + studentID + ' td:nth-child(1)').text();
        var course =  $('#' + studentID + ' td:nth-child(2)').text();
        var grade =  $('#' + studentID + ' td:nth-child(3)').text();

        $('#studentName').val(student),
        $('#course').val(course),
        $('#studentGrade').val(grade)
        changeUpdateButton(studentID);

});
}
 /***************************************************************************************************
 * getStudentID - Gets student ID
 * @param: event
 * @returns: {undefined} none
 * @calls: 
 */

function getStudentID(e){
    var studentID = $(e).parent().parent().attr('id');
    return studentID;
}

 /***************************************************************************************************
 * updateData - Updates data and displays updates
 * @param: studentID
 * @returns: {undefined} none
 * @calls: updateStudentObject,clearAddStudentFormInputs, changeSubmitButton, getData
 */
function updateData(studentID){
    var studentObject = updateStudentObject();

    var inputsValid = checkCharacters();
    console.log('inputs', inputsValid);

    if(inputsValid){
    $.ajax({
        type:'POST',
        url: 'http://localhost:8888/app.php/?request=update_data',
        data: {
        ID:studentID,
        student:studentObject.student,
        course:studentObject.course,
        grade:studentObject.grade
        },
        dataType: 'json'
}).then(()=>{
    clearAddStudentFormInputs();
    clearInputWarning();
    changeSubmitButton();
    getData();
    });
}
}

 /***************************************************************************************************
 * changeSubmitButton - Changes button back to submit button
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls:
 */
function changeSubmitButton(){
    $('#formHead').text('Add Student');
    $('#submitData').off();
    $('#submitData').on('click',handleSubmitClicked);
    $('#submitData').removeClass('btn-info');
    $('#submitData').addClass('btn-primary');
    $('#submitData').text('Submit');
}
 /***************************************************************************************************
 * changeUpdateButton - Changes button back to update button
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls:
 */
function changeUpdateButton(studentID){
    $('#formHead').text('Edit Student');
    $('#submitData').off();
    $('#submitData').removeClass('btn-primary');
    $('#submitData').addClass('btn-info');
    $('#submitData').text('Update');
    $('#submitData').on('click',()=> {
        updateData(studentID);
    });
}
 /***************************************************************************************************
 * checkCharacters - Tests inputs using regex to confirm valid
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls:
 */
function checkCharacters(){
    var testStatus = false;
    var student = $('#studentName').val();
    console.log(student);
    var course = $('#course').val();
    var grade = $('#studentGrade').val();

    var textRegex = /^[a-zA-Z\d ]{2,20}$/;
    var numberRegex = /^[\d]{1,3}$/;

    var testStudent = textRegex.test(student);
    var testCourse = textRegex.test(course);
    var testGrade = numberRegex.test(grade);
    var testObject = {name: testStudent,
                     course: testCourse,
                     grade: testGrade};

    if(testStudent && testCourse && testGrade){
        testStatus = true;
    }else{
        displayInputWarning(testObject);
    }
    return testStatus;
}
 /***************************************************************************************************
 * displayInputWarning - Adds red borders to form and warns user to edit inputs to meet requirements.
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls:
 */
function displayInputWarning(testObject){
    clearInputWarning();
    $.each(testObject, function(key, value) {
        if(!value){
            $('.'+key+'InputInvalid').removeClass('d-none')
            $('.'+key+'-group-text').addClass('invalid-border invalid-background');
            $('.'+key+'-input').addClass('invalid-border');
            $('.'+key+'-group').addClass('mb-0 mt-0');
    
        } else {
            $('.'+key+'InputValid').removeClass('d-none')
            $('.'+key+'-group').addClass('mb-0 mt-0');
            $('.'+key+'-group-text').addClass('valid-border valid-background');
            $('.'+key+'-input').addClass('valid-border');
        }
    });
    
    
}
 /***************************************************************************************************
 * clearInputWarning - Adds red borders to form and warns user to edit inputs to meet requirements.
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls:
 */
function clearInputWarning(){
    $('.validationText').addClass('d-none');
    $('.form-group').removeClass('mb-0 mt-0');
    $('.input-group-text').removeClass('valid-border valid-background invalid-border invalid-background edit-border edit-background');
    $('input').removeClass('valid-border invalid-border edit-border');
}
 /***************************************************************************************************
 * displayEditing - Adds blue borders to indicate input is being edited
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls:
 */
function displayEditing(){
    $('.input-group-text').addClass('edit-border edit-background');
    $('input').addClass('edit-border');
}