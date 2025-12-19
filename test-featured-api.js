const axios = require('axios');

async function testFeaturedJobs() {
  try {
    console.log('Testing featured jobs API...');
    const response = await axios.get('http://localhost:5000/api/jobs?featured=true&limit=6');
    
    console.log('\nAPI Response Status:', response.status);
    console.log('Response Data Structure:', Object.keys(response.data));
    console.log('\nTotal Featured Jobs:', response.data.jobs?.length || 0);
    
    if (response.data.jobs && response.data.jobs.length > 0) {
      console.log('\nFirst 3 Featured Jobs:');
      response.data.jobs.slice(0, 3).forEach((job, index) => {
        console.log(`${index + 1}. ${job.title} - Featured: ${job.featured}`);
      });
    } else {
      console.log('\nNo featured jobs found!');
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testFeaturedJobs();
