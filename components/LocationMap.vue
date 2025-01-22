<template>
    <div class="w-full">
        <div ref="mapContainer" class="h-[500px] w-full rounded-lg border border-gray-300"></div>
        <p v-if="selectedLocation" class="mt-2 text-sm text-gray-600">
            Selected coordinates: {{ selectedLocation.lat.toFixed(6) }}, {{ selectedLocation.lng.toFixed(6) }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
    modelValue?: { lat: number; lng: number } | null
}>()

const emit = defineEmits<{
    'update:modelValue': [{ lat: number; lng: number } | null]
}>()

const mapContainer = ref<HTMLElement | null>(null)
const map = ref<google.maps.Map | null>(null)
const marker = ref<google.maps.Marker | null>(null)
const selectedLocation = ref(props.modelValue)

// Initialize map
const initMap = () => {
    if (!mapContainer.value) return

    // Center at Dungkar Dzong
    const center = { lat: 27.330828, lng: 89.446641 }

    const mapOptions = {
        center,
        zoom: 19,
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
            },
            {
                featureType: "building",
                elementType: "geometry.stroke",
                stylers: [
                    { color: "#ffffff" },
                    { weight: 2 },
                    { visibility: "on" }
                ]
            },
            {
                featureType: "building",
                elementType: "geometry.fill",
                stylers: [
                    { color: "#ffffff" },
                    { opacity: 0.1 },
                    { visibility: "on" }
                ]
            }
        ]
    }

    map.value = new google.maps.Map(mapContainer.value, mapOptions)

    // Add click listener to map
    map.value.addListener('click', (event: google.maps.MapMouseEvent) => {
        const position = event.latLng
        if (!position) return

        updateMarker(position)
        selectedLocation.value = { lat: position.lat(), lng: position.lng() }
        emit('update:modelValue', selectedLocation.value)
    })

    // If there's an initial location, show it
    if (props.modelValue) {
        updateMarker(props.modelValue)
    }
}

// Update or create marker
const updateMarker = (position: google.maps.LatLng | { lat: number; lng: number }) => {
    if (!map.value) return

    if (marker.value) {
        marker.value.setPosition(position)
    } else {
        marker.value = new google.maps.Marker({
            position,
            map: map.value,
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

        // Add drag end listener
        marker.value.addListener('dragend', () => {
            const position = marker.value?.getPosition()
            if (!position) return

            selectedLocation.value = { lat: position.lat(), lng: position.lng() }
            emit('update:modelValue', selectedLocation.value)
        })
    }
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        selectedLocation.value = newValue
        updateMarker(newValue)
    }
})

// Initialize map when component is mounted
onMounted(() => {
    if (window.google) {
        initMap()
    }
})
</script>