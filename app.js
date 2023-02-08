#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
let studentData = [{
        studentName: 'Maaz',
        age: 22,
        grade: 'C',
        feesDeposited: 3000,
        feesRemaining: 0
    },
    {
        studentName: 'Khan',
        age: 27,
        grade: 'A',
        feesDeposited: 2000,
        feesRemaining: 1000
    }];
let feeToPay = 3000;
function animationStop() {
    return new Promise((res) => {
        setTimeout(res, 2000);
    });
}
async function animation() {
    let title = chalkAnimation.rainbow('Student Management System');
    await animationStop();
    title.stop();
}
async function studentList() {
    console.log(chalk.bgBlue('Students Enrolled'));
    console.table(studentData);
}
;
async function addStudent() {
    let newStudent = await inquirer.prompt([{
            name: 'studentName',
            type: 'input',
            message: 'Enter student name: '
        },
        {
            name: 'studentAge',
            type: 'number',
            message: 'Enter student age: ',
        },
        {
            name: 'studentGrade',
            type: 'input',
            message: 'Enter grade assigned to the student: '
        },
        {
            name: 'studentFees',
            type: 'number',
            message: 'Enter fees paid by the student: '
        }])
        .then(answer => {
        studentData.push({
            studentName: answer.studentName,
            age: answer.studentAge,
            grade: answer.studentGrade,
            feesDeposited: answer.studentFees,
            feesRemaining: feeToPay - answer.studentFees
        });
    });
    await studentList();
}
async function dropStudent() {
    let studentDrop = await inquirer.prompt([{
            name: 'studentName',
            type: 'input',
            message: 'Enter student name: '
        }])
        .then(async (answer) => {
        for (let i = 0; i < studentData.length; i++) {
            if (studentData[i].studentName == answer.studentName) {
                console.log(studentData.indexOf(answer.studentName));
                studentData.splice(studentData.indexOf(studentData[i]), 1);
                await studentList();
            }
            else {
                console.log(chalk.bgRed('Student not found'));
            }
        }
    });
}
async function mainMenu() {
    let operation = await inquirer.prompt({
        name: 'operation',
        type: 'list',
        message: 'Select an operation you want to perform: ',
        choices: ['Students Enrolled', 'Add New Student', 'Drop Student', 'Pay Fees']
    });
    switch (operation.operation) {
        case 'Students Enrolled':
            await studentList();
            break;
        case 'Add New Student':
            await addStudent();
            break;
        case 'Drop Student':
            await dropStudent();
            break;
    }
}
await animation();
mainMenu();
