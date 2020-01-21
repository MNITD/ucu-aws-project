<script>
  import {getFile, getFiles, deleteFile, addFile} from './api'
  import {blobToBase64} from './utils'
  import {fileStore} from './stores/filesStore'
  import {navigate} from 'svelte-routing'
  import {routes} from './utils'

  const loadData = () => getFiles().then(res => res.json()).then(data => fileStore.loadFiles(data))
  loadData()

  const saveFile = async () => {
    const file = document.getElementById('file-loader').files[0]

    if (file) {
      const base64 = (await blobToBase64(file)).split('base64,')[1]

      addFile({file: base64, name: file.name}).then(loadData)
    }
  }

  const onDelete = async (fileId) => {
    await deleteFile(fileId)
    fileStore.deleteFile(fileId)
  }

  const onPreview = async fileId => {
    navigate(`${routes.FILES}/${fileId}`)
  }

</script>

<style>
  .table {
    height: 400px;
  }

  .scroller {
    height: 360px;
    overflow-y: auto;
  }

  .row {
    display: flex;
    height: 40px;
    align-items: center;
  }

  .col-1 {
    flex: 1;
  }

  .col-2 {
    flex: 2;
  }

  .truncate {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .action {
    cursor: pointer;
    color: cornflowerblue;
  }

  .delete {
    cursor: pointer;
    color: red;
  }

  .load-container {
    margin-top: 40px;
    justify-content: center;
  }

  .input {
    width: 250px;
  }
</style>

<h2>
  Your files:
</h2>
<div class="table">
  <div class="row">
    <div class="col-2">Id</div>
    <div class="col-2">Name</div>
    <div class="col-1">Created At</div>
    <div class="col-1">Action</div>
  </div>
  <div class="scroller">
    {#each $fileStore.ids as fileId}
      <div class="row">
        <div class="col-2 action truncate" on:click={() => onPreview(fileId)}>{fileId}</div>
        <div class="col-2 truncate">{$fileStore.byId[fileId].fileName}</div>
        <div class="col-1">{$fileStore.byId[fileId].createdAt}</div>
        <div class="col-1 delete" on:click={() => onDelete(fileId)}>Delete</div>
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


