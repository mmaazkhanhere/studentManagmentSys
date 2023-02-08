#! /usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";

interface studentInfo{ //interface for student data
    studentName:string,
    age:number,
    grade:string,
    feePaid:number,
    feeRemaining:number
}

let studentData:studentInfo[]=[
    //dummy user data for the system including user basic info and fee due
    {
    studentName:'Maaz',
    age:22,
    grade:'C',
    feePaid:3000,
    feeRemaining:0
    },
    {
    studentName:'Khan',
    age:27,
    grade:'A',
    feePaid:2000,
    feeRemaining:1000
}]

let feeToPay:number=3000; // a variable of global scope as the total fee of the course

function animationStop(){ 
    //function for the animation duration
    return new Promise((res)=>{
        setTimeout(res,2000); //animation will run for 2 seconds
    })
}

async function animation(){
    //function for animation display
    let title=chalkAnimation.rainbow('Student Management System')
    await animationStop()
    title.stop();
}

async function studentList(){
    //function that show the students enrolled with the institution
    console.log(chalk.bgBlue('Students Enrolled')); 
    console.table(studentData); //data displayed in the table form
};


async function addStudent(){
    //function for enrolling new students in the institution program

    let newStudent=await inquirer.prompt([{ //prompting user for student information 
        name:'studentName',
        type:'input',
        message:'Enter student name: '
    },
    {
        name:'studentAge',
        type:'number',
        message:'Enter student age: ',
    },
    {
        name:'studentGrade',
        type:'input',
        message:'Enter grade assigned to the student: '
    },
    {
        name:'studentFees',
        type:'number',
        message:'Enter fees paid by the student: '
    }])
    .then(answer=>{ 
        //after the user provide data, it is add to the student enrolled list
        studentData.push({
            studentName:answer.studentName,
            age:answer.studentAge,
            grade:answer.studentGrade,
            feePaid:answer.studentFees,
            feeRemaining:feeToPay-answer.studentFees
        })
    });

    await studentList(); //calling function to display all the students enrolled
}

async function dropStudent(){
    //function for dropping the student from institution enrolled list

    let studentDrop= await inquirer.prompt([{
        name:'studentName',
        type:'input',
        message:'Enter student name: '
    }])
    .then(async answer=>{
        //after the user provide data, searching the student data list for the student to drop     
        let index:number=-1; //defaut value if the user is not found (-1 because index starts from 0 and we are doing it index based)

        for(let i=0; i<studentData.length;i++){
            //looping through user data
            if(studentData[i].studentName == answer.studentName){
                index=i; //if student is found in the list, get its index
            }
        }
    
        if(index == -1){
            //if user isnt found in the list
            console.log(chalk.bgRed('Student not found'))
        }
        else{
            //if user is found, remove him/her from the institution list
            studentData.splice(index,1);
            await studentList(); //display the institution student list
        }    
        
    })
}

async function feePayment(){
    //function for the payment of fee

    let userName=await inquirer.prompt({ //user enter a name
        name:'userName',
        type:'input',
        message:'Enter your name: '
    });

    for(let i=0;i<studentData.length;i++){
        //looping through instutition data list for the name

        if(studentData[i].studentName==userName.userName){ 
            //if the student name is found, display their due fee
            console.log(`Payment due ${studentData[i].feeRemaining}`);
            
            //if no fee is due, display it
            if(studentData[i].feeRemaining==0){
                console.log('No fee due')
            }
            else
            {
                //if fee is due, the user is ask to enter amount of fee to pay
                let feepayment=await inquirer.prompt({
                    name:'feepayment',
                    type:'number',
                    message:'Enter fee to pay: '
                })

                if(feepayment.feepayment==studentData[i].feeRemaining){
                    //if entered amount is equal to amount due, feeRemaining will be made 0 and their fee paid property gets equal to 3000
                    console.log(chalk.bgBlue(`Fee successful paid`))
                    studentData[i].feePaid=3000;
                    studentData[i].feeRemaining=0;

                    console.table(studentData[i]); //display the infomration for the student
                }
                else{
                    //if amount entered is more or less than due fee, error will be printed
                    console.log(chalk.bgRed('Wrong amount entered!'));
                }
                
            }
        }

        else{
            //if user is not found, error will be printed
            console.log(chalk.bgRed(`Student not in the database.`))
        }
    }
}

async function mainMenu(){
    //main menu function, which will be performed at least once and then repeat if the user desire to do so
    do
    {    
        let operation=await inquirer.prompt({
            name:'operation',
            type:'list',
            message:'Select an operation you want to perform: ',
            choices:['Students Enrolled','Add New Student','Drop Student','Pay Fees']
        }) //user choose the operation to perform

        switch(operation.operation){
            //perform different operation based on user choice
            case 'Students Enrolled':
                await studentList();
                break;
            case 'Add New Student':
                await addStudent();
                break;
            case 'Drop Student':
                await dropStudent();
                break;
            case 'Pay Fees':
                await feePayment();
                break;
        }

        var doAgain=await inquirer.prompt({
            //if user want to perform any other operation
            name:'doAgain',
            type:'list',
            message:'Do you want to perform other operations?',
            choices:['Yes','No']
        })
    }while(doAgain.doAgain=='Yes') //continue looping until user select No
}

await animation(); //calling the animation function
mainMenu(); //calling the main function