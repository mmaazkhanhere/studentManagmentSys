#! /usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";

interface studentInfo{
    studentName:string,
    age:number,
    grade:string,
    feesDeposited:number,
    feesRemaining:number
}

let studentData:studentInfo[]=[{
    studentName:'Maaz',
    age:22,
    grade:'C',
    feesDeposited:3000,
    feesRemaining:0
},
{
    studentName:'Khan',
    age:27,
    grade:'A',
    feesDeposited:2000,
    feesRemaining:1000
}]

let feeToPay:number=3000;

function animationStop(){
    return new Promise((res)=>{
        setTimeout(res,2000);
    })
}

async function animation(){
    let title=chalkAnimation.rainbow('Student Management System')
    await animationStop()
    title.stop();
}

async function studentList(){
    console.log(chalk.bgBlue('Students Enrolled'));
    console.table(studentData);
};


async function addStudent(){
    let newStudent=await inquirer.prompt([{
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
        studentData.push({
            studentName:answer.studentName,
            age:answer.studentAge,
            grade:answer.studentGrade,
            feesDeposited:answer.studentFees,
            feesRemaining:feeToPay-answer.studentFees
        })
    });

    await studentList();
}

async function dropStudent(){
    let studentDrop= await inquirer.prompt([{
        name:'studentName',
        type:'input',
        message:'Enter student name: '
    }])
    .then(async answer=>{
        
        for(let i=0; i<studentData.length;i++){
            
            if(studentData[i].studentName == answer.studentName){

                console.log(studentData.indexOf(answer.studentName));
                studentData.splice(studentData.indexOf(studentData[i]),1)
                await studentList();

            }
            else{
                console.log(chalk.bgRed('Student not found'))
            }    
        }
        
    })
}

async function feePayment(){
    let userName=await inquirer.prompt({
        name:'userName',
        type:'input',
        message:'Enter your name: '
    });

    for(let i=0;i<studentData.length;i++){
        if(studentData[i].studentName==userName.userName){
            console.log(`Payment due ${studentData[i].feesRemaining}`);
            if(studentData[i].feesRemaining==0){
                console.log('No fee due')
            }
            else
            {
                let feepayment=await inquirer.prompt({
                    name:'feepayment',
                    type:'number',
                    message:'Enter fee to pay: '
                })
                if(feepayment.feepayment==studentData[i].feesRemaining){
                    console.log(chalk.bgBlue(`Fee successful paid`))
                    studentData[i].feesDeposited=3000;
                    studentData[i].feesRemaining=0;
                    console.table(studentData[i]);
                }
                else{
                    console.log(chalk.bgRed('Wrong amount entered!'));
                }
                
            }
        }
    }
}

async function mainMenu(){
    do
    {    
        let operation=await inquirer.prompt({
            name:'operation',
            type:'list',
            message:'Select an operation you want to perform: ',
            choices:['Students Enrolled','Add New Student','Drop Student','Pay Fees']
        })

        switch(operation.operation){
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
            name:'doAgain',
            type:'list',
            message:'Do you want to perform other operations?',
            choices:['Yes','No']
        })
    }while(doAgain.doAgain=='Yes')
}
await animation();
mainMenu();