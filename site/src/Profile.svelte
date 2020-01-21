<script>
  import {getFile, getFiles, deleteFile, addFile} from './api'
  import {blobToBase64} from './utils'
  import {fileStore} from './stores/filesStore'

  const loadData = () => getFiles().then(res => res.json()).then(data => fileStore.loadFiles(data))
  loadData()

  const saveFile = async () => {
    const file = document.getElementById('file-loader').files[0]

    if(file) {
      const base64 = (await blobToBase64(file)).split('base64,')[1]

      addFile({file: base64, name: file.name}).then(loadData)
    }
  }

  const onPreview = async fileId => {
    const fileUrl = $fileStore.byId[fileId].url
    !fileUrl && getFile(fileId).then(data => fileStore.addFileUrl({...data, fileId}))
      const newWindow = window.open()
      newWindow.document.write(`
        <body style="padding:0; margin:0;">
          <iframe width="100%" height="100%" style="border: none;" margin="0" padding="0" src="${$fileStore.byId[fileId].url}"></iframe>
        </body>
      `)
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
  {#each $fileStore.ids as fileId}
    <div class="row">
      <div class="col action" on:click={() => onPreview(fileId)}>{fileId}</div>
      <div class="col">{$fileStore.byId[fileId].fileName}</div>
      <div class="col">{$fileStore.byId[fileId].createdAt}</div>
      <div class="col delete" on:click={() => deleteFile(fileId)}>Delete</div>
    </div>
  {:else}
    <div style="margin-top: 150px">No files found</div>
  {/each}
  </div>
  <div class="row load-container">
    <input id="file-loader" class="input" type="file" accept="image/jpeg, image/jpg, image/png">
    <button on:click={saveFile}>Save</button>
  </div>
</div>


