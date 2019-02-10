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
    console.log('initialized');
    addClickHandlersToElements();
}


/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined}
* @returns  {undefined}
*
*/
function addClickHandlersToElements(){
    console.log('addClickHandlersToElements running');
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
    console.log('submitData running');
    submitData();

}
/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick(){
    console.log('handleCancelClick running');
    clearAddStudentFormInputs();
}
/***************************************************************************************************
 * submitData - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
function submitData(){
    console.log('submitData running');
    var studentObject = {
        student: $('#studentName').val(),
        course: $('#course').val(),
        grade: $('#studentGrade').val()
    };

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
    })

    student_array.push(studentObject);
    updateStudentList(student_array);
}
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs(){
    console.log('clearAddStudentFormInputs running');
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
    console.log('renderStudentOnDom running');
    var studentNameElement = $('<td>').text(studentObj.student);
    var studentCourseElement = $('<td>').text(studentObj.course);
    var studentGradeElement = $('<td>').text(studentObj.grade);
    var studentID = studentObj.ID;

    var deleteButton = $('<i>').addClass('fas fa-trash-alt ml-2 deleteBtn');
    var editButton = $('<i>').addClass('fas fa-edit mr-2 editBtn');

    var buttonTD = $('<td>').append(editButton, deleteButton);

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
    console.log('updateStudentList running');
    for(var i = 0; i < students.length; i++){
        renderStudentOnDom(students[i]);
        renderGradeAverage(calculateGradeAverage(students));
    }
}
/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage(array){
    console.log('calculateGradeAverage running');
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
function renderGradeAverage(average) {
    console.log('renderGradeAverage running');
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
    console.log('handleGetDataClick running');
    getData();
}

/***************************************************************************************************
 * getData - Functino that gets data from the database
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: updateStudentList
 */
function getData(){
    console.log('get data running');
    student_array = [];
    var ajaxConfig = {
        dataType: 'json',
        url: 'http://localhost:8888/app.php/?request=get_data',
        method: 'get',
        success:
            function(returnedObject) {
            console.log('Success');
            console.log('result', returnedObject);

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
        },
        error: function(){
            console.log('Failure');
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
     console.log('Student data successfully sent.');
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
    $('tr').on('click',function() {
        var highlighted = $(this).hasClass("highlight");
        $('tr').removeClass("highlight");
        if(!highlighted)
                $(this).addClass("highlight");
    });
}

 /***************************************************************************************************
 * updateClickHandlers - Updates click hanlders
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls:
 */

function updateClickHandlers(){
    $('.deleteBtn').off();
    $('.editBtn').off();
    $('.deleteBtn').on('click',function(){
        console.log('deleting..');
        $.ajax({
            type:'POST',
            url: 'http://localhost:8888/app.php/?request=delete_data',
            data: {
               ID:studentID
            },
            dataType: 'json'
        })

        var studentIndex = student_array.indexOf(studentObj);
        student_array.splice(studentIndex,1);
        $(this).parents('tr').remove();
    });

    $('.editBtn').on('click',function(event){
        // console.log('this: ',$(this).parent().val());
        console.log('edit BTN clicked');
        var studentID = getStudentID(event.target);
        var student = $('#' + studentID + ' td:nth-child(1)').text();
        var course =  $('#' + studentID + ' td:nth-child(2)').text();
        var grade =  $('#' + studentID + ' td:nth-child(3)').text();

        $('#studentName').val(student),
        $('#course').val(course),
        $('#studentGrade').val(grade)
        $('#submitData').text('Update');
        $('#submitData').removeClass('btn-primary');
        $('#submitData').addClass('btn-info');
        $('#submitData').off();
        $('#submitData').on('click',()=> {
            updateData(studentID);
        });
        
});

function getStudentID(e){
    var studentID = $(e).parent().parent().attr('id');
    return studentID;
}

function updateData(studentID){

var studentObject = updateStudentObject();

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
}).then(changeSubmitButton);
}

function changeSubmitButton(){
    $('#submitData').off();
    $('#submitData').on('click',handleSubmitClicked);
    $('#submitData').removeClass('btn-info');
    $('#submitData').addClass('btn-primary');
    $('#submitData').text('Submit');
    $('#studentName').val('');
    $('#course').val('');
    $('#studentGrade').val('');
    getData();
}

function updateStudentObject(){
    var student = $('#studentName').val();
    var course = $('#course').val();
    var grade = $('#studentGrade').val();

    var studentObect = {
        student: student,
        course: course,
        grade: grade
    };
    return studentObect;
}

}