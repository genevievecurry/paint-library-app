<script>
  export let notes;
</script>

{#if notes.length > 0}
  <section class="mt-8">
    <h2 class="font-bold text-2xl">Artist Notes</h2>

    {#each notes as note}
      <div>
        <div class="flex my-4">
          <div
            class="rounded-full bg-green-500 text-white font-extrabold w-10 h-10 grid place-items-center text-xl mr-2"
          >
            <span>{note.author.displayName.substr(0, 1)}</span>
          </div>
          <div>
            <div class="text-xs"
              >{note.author.displayName}
              <span class="text-gray-500">{note.createdAt}</span>
            </div>
            <div class="my-2">{@html note.content}</div>
          </div>
        </div>

        {#each note.childNotes as childNote}
          <div class="flex ml-10 my-4">
            <div
              class="rounded-full bg-green-300 text-white font-bold w-8 h-8 grid place-items-center text-lg mr-2"
            >
              <span>{childNote.author.displayName.substr(0, 1)}</span>
            </div>
            <div>
              <div class="text-xs"
                >{childNote.author.displayName}
                <span class="text-gray-500">{childNote.createdAt}</span>
              </div>
              <div class="my-2">{@html childNote.content}</div>
            </div>
          </div>
        {/each}
      </div>
    {/each}
  </section>
{/if}
