<script>
  export let qualities;
</script>

<section>
  <h2>Qualities</h2>

  <table>
    <tr>
      <td>Lightfastness</td>
      <td>
        {qualities.lightfast_rating.name}
        <em>{qualities.lightfast_rating.description}</em>
      </td>
    </tr>
    <tr>
      <td>Transparency</td>
      <td>
        {qualities.transparency_rating.name}
        <em>{qualities.transparency_rating.description}</em>
      </td>
    </tr>
    <tr>
      <td>Staining</td>
      <td>
        {qualities.staining_rating.name}
        <em>{qualities.staining_rating.description}</em>
      </td>
    </tr>
    <tr>
      <td>Granulation</td>
      <td>
        {qualities.granulation_rating.name}
        <em>{qualities.granulation_rating.description}</em>
      </td>
    </tr>
  </table>
</section>