const { execSync } = require('child_process');

try {
  const output = execSync('python replace_scenarios_colors.py', {
    cwd: 'C:\\Users\\DELL\\Desktop\\mortious\\LexAI',
    encoding: 'utf-8'
  });
  console.log(output);
} catch (error) {
  console.error('Error:', error.message);
  if (error.stdout) console.log(error.stdout);
  if (error.stderr) console.error(error.stderr);
}
