// Dynamic import of the prompt-sync package
import('prompt-sync').then((module) => {
    const prompt = module.default();
    var gender = prompt('Are you a male or female? (M - male, F - female): ');

    if(gender == 'M' || gender == 'F'){
        console.log(gender);
    }else{
        console.log('Try again.');
    }
}).catch(error => {
    console.error('Error importing prompt-sync:', error);
});
