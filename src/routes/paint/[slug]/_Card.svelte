<style>
  .swatch-card {
    min-height: 125px;
  }
</style>

<script lang="ts">
  import { goto } from '$app/navigation';
  import { getContext } from 'svelte';
  import imagekit from '$lib/config/imagekit';
  import type { ImageKitUpload, Paper, SwatchCardType, User } from '.prisma/client';

  export let id: number;
  export let updatedAt: Date;
  export let swatchCardType: SwatchCardType;
  export let paper: Paper;
  export let author: User;
  export let description: string;
  export let imageKitUpload: ImageKitUpload;
  export let tall: boolean;

  let userImageUpload: any;
  let imageKitData = {
    fileId: null,
    filePath: null,
    name: null,
    thumbnailUrl: null,
    url: null,
  };
  let modalVisible = false;
  let swatchActionsVisible = false;
  // let saving = false; // Todo handle waiting state
  // let papers = []; // Todo fix paper problems

  const slug: string = getContext('slug');
  const editable: boolean = getContext('editable');
  const hex: string = getContext('hex');

  const timeAgo = () => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const now = new Date();
    const updated = new Date(updatedAt);

    const secondsBetween = Math.abs(Number(updated) - Number(now)) / 1000;
    const minutesBetween = Math.floor(secondsBetween / 60);
    const hoursBetween = Math.floor(secondsBetween / (60 * 60));
    const daysBetween = Math.floor(secondsBetween / (60 * 60 * 24));

    if (daysBetween === 0 && hoursBetween < 12 && hoursBetween > 0) {
      return rtf.format(-hoursBetween, 'hour');
    } else if (daysBetween === 0 && hoursBetween === 0) {
      return rtf.format(-minutesBetween, 'minute');
    }
    return rtf.format(-daysBetween, 'day');
  };

  function onChooseUpload(event: any) {
    userImageUpload = event.target.files[0];
  }

  function toggleModal() {
    modalVisible = !modalVisible;
  }

  function showSwatchActions() {
    swatchActionsVisible = !swatchActionsVisible;
  }

  // Todo: Move this into a utility - duplicated in _Creator.svelte
  async function uploadImage() {
    imagekit.upload(
      {
        file: userImageUpload,
        fileName: userImageUpload.name,
        useUniqueFileName: true,
      },
      function (err, result) {
        if (err === null) {
          imageKitData = result;
        } else {
          // Todo: Handle error
          console.log(err);
        }
      },
    );
  }

  function onsubmit() {
    modalVisible = false;
  }

  async function onresponse(res: any): Promise<void> {
    if (res.ok) {
      goto(`/paint/${slug}`);
    } else {
      console.log(res);
    }
  }

  function upload(node: HTMLFormElement): SvelteActionReturnType {
    const handler = async (event: any) => {
      const body = new FormData(node);
      event.preventDefault();
      onsubmit();

      const response: Response = await fetch(node.action, {
        method: node.method,
        body,
        headers: {
          accept: 'application/json',
        },
      });

      onresponse(response);
    };
    node.addEventListener('submit', handler);

    return {
      update() {},
      destroy() {
        node.removeEventListener('submit', handler);
      },
    };
  }

  let background: string;
  // todo: Handle the other swatch situations; will likely need some assets
  switch (swatchCardType?.name) {
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

<div class="{`swatch-card border border-black p-2 relative ${tall ? 'md:row-span-full' : ''}`}">
  <div class="absolute left-0 top-0 {swatchActionsVisible ? 'z-10' : ''}">
    <div class="bg-white p-1 flex items-center">
      <div class="cursor-pointer" on:click="{showSwatchActions}">
        {#if !swatchActionsVisible && imageKitUpload?.url}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="{1.5}"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        {:else if !swatchActionsVisible && !imageKitUpload?.url}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="{1.5}"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="{1.5}"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        {/if}
      </div>
      <div class="text-sm ml-1">{swatchCardType?.label}</div>
    </div>
    {#if swatchActionsVisible && imageKitUpload?.url}
      <div class="bg-white z-10">
        <div class="p-3">
          <p>{swatchCardType.description}</p>
          {#if author}
            <hr class="my-2" />
            <span class="text-xs block font-medium">Notes from {author.displayName}:</span>
            <div class="text-xs mt-2">{@html description}</div>
            <p class="text-xs mt-2 leading-tight">Uploaded by {author.displayName} {timeAgo()}.</p>
          {:else}
            <p class="text-xs mt-2 leading-tight">Uploaded {timeAgo()}.</p>
          {/if}
        </div>
      </div>
    {:else if swatchActionsVisible && !imageKitUpload?.url}
      <div class="bg-white z-10">
        <div class="p-3">
          <span class="text-md block"
            >This is a placeholder for a <strong>{swatchCardType?.label}</strong> Swatch</span
          >
          <p class="text-xs mt-2"
            >It was automatically generated and likely deeply unsatisfactory. If you have the time
            or inclination, please consider contributing your own swatch to the project!</p
          >
          {#if editable}
            <button
              type="button"
              on:click="{toggleModal}"
              class="my-4 inline-flex justify-center py-1 px-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 font-extrabold text-sm"
              >Contribute a Swatch</button
            >
          {/if}
        </div>
      </div>
    {/if}
  </div>

  {#if imageKitUpload?.url}
    <div
      class="h-full w-full bg-cover bg-center"
      style="{`background-image: url(${imageKitUpload.url})`}"></div>
  {:else}
    <div class="empty-swatch h-full p-2 z-0" style="{`background: ${background}`}"></div>
  {/if}

  {#if paper}
    <div class="absolute right-0 bottom-0">
      <div class="bg-white inline-block p-1 text-xs"
        >on {paper.description} ({paper.weightInLbs}lb)</div
      >
    </div>
  {/if}
</div>

{#if modalVisible}
  <div
    class="fixed z-10 inset-0 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div
        class="{`fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${
          modalVisible ? 'opacity-100' : 'opacity-0'
        }`}"
        aria-hidden="true"></div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
        >&#8203;</span
      >

      <div
        class="{`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
          modalVisible
            ? 'opacity-100 translate-y-0 sm:scale-100'
            : 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
        }`}"
      >
        <div class="bg-white px-3 pt-5 pb-4 sm:pt-6 sm:p-3 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="leading-6 font-extrabold text-2xl" id="modal-title">
                Contribute a {swatchCardType.label} Swatch
              </h3>
              <p class="text-sm text-gray-500 mt-2">Instructions: {swatchCardType.description}</p>
              {#if !imageKitData?.fileId}
                <div class="my-4">
                  <input
                    type="file"
                    id="swatchCardImageKitUpload"
                    name="swatchCardImageKitUpload"
                    on:change="{onChooseUpload}"
                  />
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

        <form action="/paint/edit.json" method="post" use:upload>
          {#if imageKitData.fileId}
            <input type="hidden" name="id" id="id" value="{id}" />
            <input
              type="hidden"
              name="uploadFileId"
              id="uploadFileId"
              value="{imageKitData.fileId}"
            />
            <input
              type="hidden"
              name="uploadFilePath"
              id="uploadFilePath"
              value="{imageKitData.filePath}"
            />
            <input type="hidden" name="uploadName" id="uploadName" value="{imageKitData.name}" />
            <input
              type="hidden"
              name="uploadThumbnailUrl"
              id="uploadThumbnailUrl"
              value="{imageKitData.thumbnailUrl}"
            />
            <input type="hidden" name="uploadUrl" id="uploadUrl" value="{imageKitData.url}" />

            <fieldset class="p-6">
              <!-- <div class="mt-6">
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
              </div> -->

              <div class="mt-6">
                <label for="description" class="block text-sm text-gray-500"
                  >Swatch Description *</label
                >
                <textarea
                  required
                  id="description"
                  name="description"
                  class="mt-2 block w-full py-2 px-3 border border-black focus:outline-none focus:ring-green-400 focus:border-green-400"
                ></textarea>
              </div>
            </fieldset>
          {/if}

          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Upload
            </button>
            <button
              type="button"
              on:click="{toggleModal}"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}
