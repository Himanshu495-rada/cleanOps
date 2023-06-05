async function getData() {
  let res = await fetch(
    'http://68.178.168.6:8090/api/collections/tokens/records',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        token: 'your data here',
      }),
    },
  );
  let response = await res.json();
  console.log(response);
}

getData();
