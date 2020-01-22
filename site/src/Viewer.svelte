<script>
  import {fileStore} from './stores/filesStore'
  import {getFile} from './api'

  export let fileId = null

  const fileUrl = $fileStore.byId[fileId].url
  const promise = fileUrl || getFile(fileId).then(res => res.json()).then(data => {
    fileStore.addFileUrl({...data, fileId})
    return data
  })
</script>
{#await promise }
  Loading...
{:then data}
  <img width="600px" src="{$fileStore.byId[fileId].url}" alt="">
<!--  <iframe width="100%" height="100%" style="border: none;" margin="0" padding="0" src="{$fileStore.byId[fileId].url}"></iframe>-->
{:catch name}
  Oops something went wrong please try again
{/await}
