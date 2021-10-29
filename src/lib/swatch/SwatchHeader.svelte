<script>
  export let title;
  export let manufacturerName;
</script>

<header>
  <div>
    <h1>
      {title}
    </h1>
    {manufacturerName}
  </div>
</header>

<style>
  header {
    display: flex;
    border: 1px solid #000;
    padding: 10px;
    margin: 10px;
  }
</style>
