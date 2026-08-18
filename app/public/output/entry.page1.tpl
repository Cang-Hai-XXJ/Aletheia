<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{name}}</title>
    <link href="/static/logo.png" rel="icon" type="image/x-icon">
    <link href="/static/normalize.css" rel="stylesheet">
</head>
<body style="color : red">
  <h1>page1</h1>
  <input id= 'env' value ="{{env}}" style="display:none"></input>
  <input id= 'options' value ="{{options}}" style="display:none"></input>
  <button onclick="handleClick()">click me
  </button>
</body>

<script src="https://cdn.bootcss.com/axios/0.18.0/axios.min.js"></script>
<script>
  window.env = document.getElementById('env').value
  const options = document.getElementById('options').value
  try {
    window.options = JSON.parse(options)
  } catch (e) {
    console.log(e)
  }
 
  const handleClick = ()=>{
    axios.get('/api/project/list').then(res => console.log(res))
  }
</script>
</html>