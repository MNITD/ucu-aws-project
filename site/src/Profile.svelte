<script>
  import {getFiles, deleteFile, addFile} from './api'
  import {blobToBase64} from './utils'

  let files = [
    {
      'createdAt': '1579575783',
      'fileName': 'my_file.png',
      'userId': '0f6c2c90-a015-4bfd-89ac-0f5a1005eb56',
      'fileId': '16035fa2-f6ee-49a2-b83a-9b923e0bd215',
    },
    {
      'createdAt': '1579575783',
      'fileName': 'my_file.png',
      'userId': '0f6c2c90-a015-4bfd-89ac-0f5a1005eb56',
      'fileId': '16035fa2-f6ee-49a2-b83a-9b923e0bd215',
    },
    {
      'createdAt': '1579575783',
      'fileName': 'my_file.png',
      'userId': '0f6c2c90-a015-4bfd-89ac-0f5a1005eb56',
      'fileId': '16035fa2-f6ee-49a2-b83a-9b923e0bd215',
    },
    {
      'createdAt': '1579575783',
      'fileName': 'my_file.png',
      'userId': '0f6c2c90-a015-4bfd-89ac-0f5a1005eb56',
      'fileId': '16035fa2-f6ee-49a2-b83a-9b923e0bd215',
    },
    {
      'createdAt': '1579575783',
      'fileName': 'my_file.png',
      'userId': '0f6c2c90-a015-4bfd-89ac-0f5a1005eb56',
      'fileId': '16035fa2-f6ee-49a2-b83a-9b923e0bd215',
    },
    {
      'createdAt': '1579575783',
      'fileName': 'my_file.png',
      'userId': '0f6c2c90-a015-4bfd-89ac-0f5a1005eb56',
      'fileId': '16035fa2-f6ee-49a2-b83a-9b923e0bd215',
    },
    {
      'createdAt': '1579575783',
      'fileName': 'my_file.png',
      'userId': '0f6c2c90-a015-4bfd-89ac-0f5a1005eb56',
      'fileId': '16035fa2-f6ee-49a2-b83a-9b923e0bd215',
    },
    {
      'createdAt': '1579575783',
      'fileName': 'my_file.png',
      'userId': '0f6c2c90-a015-4bfd-89ac-0f5a1005eb56',
      'fileId': '16035fa2-f6ee-49a2-b83a-9b923e0bd215',
    },
    {
      'createdAt': '1579575783',
      'fileName': 'my_file.png',
      'userId': '0f6c2c90-a015-4bfd-89ac-0f5a1005eb56',
      'fileId': '16035fa2-f6ee-49a2-b83a-9b923e0bd215',
    },
    {
      'createdAt': '1579575783',
      'fileName': 'my_file.png',
      'userId': '0f6c2c90-a015-4bfd-89ac-0f5a1005eb56',
      'fileId': '16035fa2-f6ee-49a2-b83a-9b923e0bd215',
    },
    {
      'createdAt': '1579575783',
      'fileName': 'my_file.png',
      'userId': '0f6c2c90-a015-4bfd-89ac-0f5a1005eb56',
      'fileId': '16035fa2-f6ee-49a2-b83a-9b923e0bd215',
    },
    {
      'createdAt': '1579575783',
      'fileName': 'my_file.png',
      'userId': '0f6c2c90-a015-4bfd-89ac-0f5a1005eb56',
      'fileId': '16035fa2-f6ee-49a2-b83a-9b923e0bd215',
    },
  ]

  const loadData = () => getFiles().then(res => res.json()).then(data => files = data)
  loadData()

  const saveFile = async () => {
    const file = document.getElementById('file-loader').files[0]

    if(file) {
      const base64 = await blobToBase64(file).split('base64,')[1]

      addFile({file: base64, name: file.name}).then(loadData)
    }
  }

</script>

<style>
  .table{
    height: 400px;
  }
  .scroller{
    height: 360px;
    overflow-y: auto;
  }
  .row {
    display: flex;
    height: 40px;
    align-items: center;
  }

  .col {
    flex: 1;
  }

  .action{
    cursor: pointer;
    color: cornflowerblue;
  }
  .delete{
    cursor: pointer;
    color: red;
  }

  .load-container{
    margin-top: 40px;
    justify-content: center;
  }
  .input{
    width: 250px;
  }
</style>

<h2>
  Your files:
</h2>
<div class="table">
  <div class="row">
    <div class="col">Id</div>
    <div class="col">Name</div>
    <div class="col">Created At</div>
    <div class="col">Action</div>
  </div>
  <div class="scroller">
  {#each files as file}
    <div class="row">
      <div class="col action">{file.fileId}</div>
      <div class="col">{file.fileName}</div>
      <div class="col">{file.createdAt}</div>
      <div class="col delete" on:click={() => deleteFile(file.fileId)}>Delete</div>
    </div>
  {:else}
    No files found
  {/each}
  </div>
  <div class="row load-container">
    <input id="file-loader" class="input" type="file" accept="image/jpeg, image/jpg, image/png">
    <button on:click={saveFile}>Save</button>
  </div>
</div>


