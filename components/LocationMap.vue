<template>
    <div class="w-full h-full">
        <div ref="mapContainer" class="w-full h-full rounded-lg border border-gray-300"></div>
        <div v-if="!readonly && selectedLocation" class="mt-2 text-sm text-gray-600">
            Selected coordinates: {{ selectedLocation.lat.toFixed(6) }}, {{ selectedLocation.lng.toFixed(6) }}
        </div>
    </div>
</template>

<script setup lang="ts">
/// <reference types="@types/google.maps" />
import { useNuxtApp } from '#app';
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
    modelValue: { lat: number; lng: number } | null
    readonly?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: { lat: number; lng: number } | null): void
}>()

const mapContainer = ref<HTMLElement | null>(null)
const map = ref<google.maps.Map | null>(null)
const marker = ref<google.maps.Marker | null>(null)
const selectedLocation = ref(props.modelValue)
const { $googleMapsReady } = useNuxtApp()

const initMap = async () => {
    if (!mapContainer.value) return

    try {
        // Wait for Google Maps to be ready
        await $googleMapsReady

        const center = props.modelValue || { lat: 27.331252613158244, lng: 89.44666245759026 }
        const mapOptions: google.maps.MapOptions = {
            center,
            zoom: 16,
            mapTypeId: 'satellite',
            streetViewControl: false,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                position: google.maps.ControlPosition.TOP_RIGHT,
                mapTypeIds: ['satellite', 'hybrid']
            },
            tilt: 0,
            styles: [
                {
                    featureType: "all",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                }
            ]
        }

        map.value = new google.maps.Map(mapContainer.value, mapOptions)

        // Add marker if coordinates are provided
        if (props.modelValue) {
            marker.value = new google.maps.Marker({
                position: props.modelValue,
                map: map.value,
                draggable: !props.readonly,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: '#4F46E5',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2
                }
            })
        }

        // Add click listener only if not readonly
        if (!props.readonly) {
            map.value.addListener('click', (e: google.maps.MapMouseEvent) => {
                const position = e.latLng
                if (!position) return

                selectedLocation.value = {
                    lat: position.lat(),
                    lng: position.lng()
                }

                if (marker.value) {
                    marker.value.setPosition(position)
                } else {
                    marker.value = new google.maps.Marker({
                        position,
                        map: map.value!,
                        draggable: true,
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 10,
                            fillColor: '#4F46E5',
                            fillOpacity: 1,
                            strokeColor: '#ffffff',
                            strokeWeight: 2
                        }
                    })
                }

                emit('update:modelValue', selectedLocation.value)
            })

            // Add drag end listener if marker is draggable
            if (marker.value) {
                marker.value.addListener('dragend', () => {
                    const position = marker.value?.getPosition()
                    if (!position) return

                    selectedLocation.value = {
                        lat: position.lat(),
                        lng: position.lng()
                    }
                    emit('update:modelValue', selectedLocation.value)
                })
            }
        }
    } catch (error) {
        console.error('Error initializing map:', error)
    }
}

// Watch for modelValue changes to update marker position
watch(() => props.modelValue, (newValue) => {
    if (!map.value || !newValue) return

    selectedLocation.value = newValue

    if (marker.value) {
        marker.value.setPosition(newValue)
    } else {
        marker.value = new google.maps.Marker({
            position: newValue,
            map: map.value,
            draggable: !props.readonly,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#4F46E5',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2
            }
        })
    }

    map.value.panTo(newValue)
}, { deep: true })

onMounted(() => {
    initMap()
})
</script>