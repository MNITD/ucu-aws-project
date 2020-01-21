<script>
  import {onMount} from 'svelte'
  import {authStore} from './stores/authStore'
  import {login, logout} from './api'
  import Profile from './Profile.svelte'

  let currentPage = 'home'

  onMount(() => {
    const searchParams = new URLSearchParams(document.location.hash.replace('#', '?'))
    const idToken = searchParams.get('id_token')
    if (idToken) {
      const expirationTime = Date.now() + searchParams.get('expires_in') * 1000
      localStorage.setItem('idToken', idToken)
      localStorage.setItem('expirationTime', expirationTime)
      authStore.set({idToken, expirationTime})

      document.location.href = '/'
    }
  })

</script>

<style>
  header {
    height: 80px;
    display: flex;
    align-items: center;
    padding: 0 80px;
    justify-content: flex-end;
  }

  main {
    text-align: center;
  }

  button:hover {
    cursor: pointer;
  }
</style>

<header>
  {#if $authStore.idToken}
    {#if currentPage === 'home'}
      <button on:click={() => currentPage = 'profile'} style="margin-right: 10px">Profile</button>
    {/if}
    <button on:click={logout}>Logout</button>
  {:else}
    <button on:click={login}>Login</button>
  {/if}
</header>
<main>
  {#if currentPage === 'home'}
    <h1>Welcome to Personal Bucket!</h1>
    <p>The best file storage since 1970</p>
  {:else}
    <Profile/>
  {/if}
</main>
