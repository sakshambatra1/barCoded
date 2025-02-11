const BASE_URL = 'http://localhost:5000'; // URL of your running server

describe('Live API Tests (Using fetch)', () => {

  it('should successfully add a user and return 200 status', async () => {
    const response = await fetch(`${BASE_URL}/api/userInfo/addUserInfo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'JohnDoe',
        weight: 75,
        age: 30,
        fitnessLevel: 'Intermediate',
        healthCondition: false,
        sex: 'Male',
      }),
    });

    const responseData = await response.json();
    expect(response.status).toBe(200);
    expect(responseData).toHaveProperty('success', 'Data added successfully');
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await fetch(`${BASE_URL}/api/userInfo/addUserInfo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'JohnDoe',
        age: 30,
        sex: 'Male',
      }), // Missing weight, fitnessLevel, and healthCondition
    });

    const responseData = await response.json();
    expect(response.status).toBe(400);
    expect(responseData).toHaveProperty('error', 'All fields must be defined');
  });

  it('should prevent SQL injection', async () => {
    const response = await fetch(`${BASE_URL}/api/userInfo/addUserInfo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: `JohnDoe'; DROP TABLE "UserInfo"; --`,
        weight: 75,
        age: 30,
        fitnessLevel: 'Intermediate',
        healthCondition: false,
        sex: 'Male',
      }),
    });

    const responseData = await response.json();
    expect(response.status).toBe(200);
    expect(responseData).toHaveProperty('success', 'Data added successfully');
  });

  it('should handle XSS attack input', async () => {
    const response = await fetch(`${BASE_URL}/api/userInfo/addUserInfo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: '<script>alert("XSS")</script>',
        weight: 75,
        age: 30,
        fitnessLevel: 'Intermediate',
        healthCondition: false,
        sex: 'Male',
      }),
    });

    const responseData = await response.json();
    expect(response.status).toBe(200);
    expect(responseData).toHaveProperty('success', 'Data added successfully');
  });

});
