<template>
  <!-- THESE ARE ALL AUTO GENERATED AND ARE MEANT TO BE REPLACED. -->
  <main>
    <Logo id='logo'/>
    <h1>\{{ $t('404') }}</h1>
    <p v-html='$t("description")'></p>
    <router-link type='button' :to='$locale.current() === "en" ? "/" : "/jp"'>\{{ $t('return') }}</router-link>
  </main>
</template>

<script>
  // THESE ARE ALL AUTO GENERATED AND ARE MEANT TO BE REPLACED.
  import Logo from '@/components/Logo'

  export default {
    data() {
      return {
      }
    },
    components: {
      Logo
    }
  }
</script>

<style lang='scss' scoped>
  // THESE ARE ALL AUTO GENERATED AND ARE MEANT TO BE REPLACED.
  main {
    width: 100%;
    height: 100%;
    padding: 30px;
    position: absolute;
    justify-content: center;
    align-content: center;
    align-items: center;
    flex-flow: column nowrap;
    flex: 0 1 auto;
    display: flex;
    box-sizing: border-box;

    #logo {
      margin-bottom: 3em;
    }

    h1 {
      padding: 0;
      margin: 0;
      color: #fff;
      font-size: 4em;
      text-align: center;
    }

    p {
      color: #aaa;
      font-size: 1em;
      text-align: center;
    }

    a[type='button'] {
      width: 120px;
      height: 40px;
      background: #fff;
      color: #111;
      font-weight: 400;
      text-transform: uppercase;
      box-sizing: border-box;
      justify-content: center;
      align-content: center;
      align-items: center;
      flex-flow: column nowrap;
      display: flex;
    }
  }
</style>
