<script>
  import { getContext } from 'svelte';
  import imagekit from '$lib/config/imagekit';
  import { goto } from '$app/navigation';
  export let data;
  export let id;
  export let createdAt;
  export let updatedAt;
  export let swatchCardType;
  export let paper;
  export let author;
  export let description;
  export let imageKitUpload;
  export let focus;

  let papers = [];

  const slug = getContext('slug');
  const editable = getContext('editable');
  const hex = getContext('hex');

  if(editable) {
    papers = getContext('papers');
  }

  let userImageUpload;
  let imageKitData = {};
  let modalVisible = false;
  let saving = false;

  function onChooseUpload(event) {
    userImageUpload = event.target.files[0];
  }

  function toggleModal() {
    modalVisible = !modalVisible;
  }

  // Todo: Move this into a utility - duplicated in _Editor.svelte
  async function uploadImage() {
    imagekit.upload({
    file: userImageUpload,
    fileName: userImageUpload.name,
    useUniqueFileName: true,
  }, function(err, result) {
      if(err === null){
        imageKitData = result;
      } else {
        // Todo: Handle error
        console.log(err)
      }
    })
  }

  const onsubmit = () => {
    saving = true;
    modalVisible = false;
  };

  const onresponse = async (res) => {
    if (res.ok) {
      goto(`/swatch/${slug}`);
    }
  };
  const noop = () => {};

  async function ajax(node, { onsubmit = noop, onresponse = noop }) {
    const handler = async (event) => {
      const body = new FormData(node);
      event.preventDefault();
      onsubmit();

      const response = await fetch(node.action, {
        method: node.method,
        body,
        headers: {
          accept: 'application/json',
        },
      });

      // @ts-ignore
      onresponse(response);
    };
    node.addEventListener('submit', handler);

    return {
      destroy() {
        node.removeEventListener('submit', handler);
      },
    };
  }

  let background;

  switch(swatchCardType.name) {
    case 'GRADIENT':
      background = `linear-gradient(180deg, ${hex} 0%, ${hex}20 100%)`;
      break;
    case 'DISPERSEMENT':
      background = `linear-gradient(90deg, ${hex} 0%, ${hex}20 30%, rgba(255,255,255,1) 100%)`;
      break;
    case 'HIGH_DILUTION':
      background = `${hex}25`;
      break;
    case 'MID_DILUTION':
      background = `${hex}50`;
      break;
    default:
      background = hex;
  }
</script>

<div class="{`swatch-card ${focus ? "focused" : ""}`}">
  
  {#if imageKitUpload?.url}
    <div class="overflow-hidden">
      <img src="{imageKitUpload?.url}" alt="" />
    </div>
  {:else}
    <div class="empty-swatch h-full flex flex-col p-2" style="{`background: ${background}`}" >
      <button type="button" on:click="{toggleModal}" class="border border-white text-white p-2">Contribute a {swatchCardType?.label} Swatch</button>
      <span class="text-white text-xs">{swatchCardType?.description}</span>
    </div>
  {/if}

  {#if paper}
    <div class="absolute right-0 top-0">
      <div class="bg-white inline-block p-1 text-xs">{paper.description} ({paper.weightInLbs}lb)</div>
    </div>
    <div class="absolute left-0 bottom-0">
      <div class="bg-white inline-block p-1 text-sm">{swatchCardType?.label}</div>
      <div class="bg-white inline-block p-1 text-xs">{swatchCardType?.description}</div>
    </div>
  {/if}
</div>

{#if modalVisible}
  <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="{`fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${modalVisible ? "opacity-100" : "opacity-0" }`}" aria-hidden="true"></div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="{`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${modalVisible ? "opacity-100 translate-y-0 sm:scale-100" : "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"}`}">
        
        <div class="bg-white px-3 pt-5 pb-4 sm:pt-6 sm:p-3 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="leading-6 font-extrabold text-2xl" id="modal-title">
                Contribute a {swatchCardType.label} Swatch
              </h3>
              <p class="text-sm text-gray-500 mt-2">Instructions: {swatchCardType.description}</p>
              {#if !imageKitData.fileId}

                <div class="my-4">
                  <input type="file" id="swatchCardImageKitUpload" name="swatchCardImageKitUpload" on:change="{onChooseUpload}" />
                </div>
                {#if userImageUpload}
                  <div 
                    on:click="{uploadImage}"
                    class="inline-flex justify-center py-1 px-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 font-medium"
                  >
                    Yes, upload this!
                  </div>
                {/if}
              {:else}
                  Preview: 
                  <img src="{imageKitData.thumbnailUrl}" alt="{imageKitData.fileId}" />
              {/if}
            </div>
          </div>
        </div>

        
        <form action="/swatch/edit.json" method="post" use:ajax="{{ onsubmit, onresponse }}">
          {#if imageKitData.fileId}
            <input type="hidden" name="id" id="id" value="{id}" />
            <input type="hidden" name="uploadFileId" id="uploadFileId" value="{imageKitData.fileId}" />
            <input type="hidden" name="uploadFilePath" id="uploadFilePath" value="{imageKitData.filePath}" />
            <input type="hidden" name="uploadName" id="uploadName" value="{imageKitData.name}" />
            <input type="hidden" name="uploadThumbnailUrl" id="uploadThumbnailUrl" value="{imageKitData.thumbnailUrl}" />
            <input type="hidden" name="uploadUrl" id="uploadUrl" value="{imageKitData.url}" />

            <fieldset class="p-6">
              <div class="mt-6">
                <label for="paperId" class="block text-sm text-gray-500">Paper Type</label>

                <select
                  id="paperId"
                  name="paperId"
                  class="mt-1 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400"
                >
                  {#each papers as paper}
                    <option value="{paper.id}">
                      {paper.description} ({paper.weightInLbs} lbs)
                    </option>
                  {/each}
                </select>
          
              </div>

              <div class="mt-6">
                <label for="description" class="block text-sm text-gray-500"
                  >Swatch Description</label
                >
                <textarea
                  id="description"
                  name="description"
                  class="mt-2 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400"
                ></textarea>
              </div>

            </fieldset>
            {/if}


          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="submit"  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
              Upload
            </button>
            <button type="button" on:click="{toggleModal}" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}

<style>
  .swatch-card {
    @apply border border-black p-1 relative;
  }

  .focused {
    @apply row-span-4;
    min-height: 400px;
  }

  .empty-swatch {
    min-height: 50px;
  }
</style>
