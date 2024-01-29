<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <form @submit.prevent="buscar" class="d-flex">
          <div class="mb-3 me-2 flex-grow-1">
            <input v-model="consulta" type="text" class="form-control" id="consulta" placeholder="Buscar ... " />
          </div>
          <div class="mb-3 me-2">
            <button type="submit" class="btn btn-primary">Buscar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Número de resultados -->
    <div v-if="resultados.length > 0" class="mb-3">
      <p class="text-muted">{{ resultados.length }} resultado(s) encontrado(s)</p>
    </div>

    <!-- Mostrar la tabla solo si hay resultados (tanto al principio como con la búsqueda) -->
    <table class="table" v-if="paginatedResults.length > 0">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Titulo</th>
          <th>Contenido</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in paginatedResults" :key="post.id">
          <td>{{ post.id }}</td>
          <td>{{ post.title }}</td>
          <td>{{ post.body }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Páginacion -->
    <nav v-if="pageCount > 1">
      <ul class="pagination">
        <li class="page-item" v-for="pageNumber in pageCount" :key="pageNumber" :class="{ 'active': pageNumber === currentPage }">
          <a class="page-link" @click="changePage(pageNumber)">{{ pageNumber }}</a>
        </li>
      </ul>
    </nav>

    <!-- Si no hay resultados-->
    <div v-else>
      No se encontraron resultados.
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import axiosInstance from '@/logic/axios_instance.js';

export default {
  setup() {
    const consulta = ref('');
    const resultados = ref([]);
    const pageSize = 10; // Número de resultados por página
    const currentPage = ref(1);

    const buscar = async () => {
      try {
        if (!axiosInstance) {
          console.error('La instancia de axiosInstance no está definida.');
          return;
        }

        const response = await axiosInstance.get('/posts');
        resultados.value = response.data;

        // Filtrar resultados basados en la consulta
        if (consulta.value.trim() !== '') {
          const consultaLower = consulta.value.toLowerCase();
          resultados.value = resultados.value.filter(
            (post) =>
              post.body.toLowerCase().includes(consultaLower) ||
              post.title.toLowerCase().includes(consultaLower)
          );
        }

        // Cambiar a la primera página después de cada búsqueda
        currentPage.value = 1;
      } catch (error) {
        console.error('Error al realizar la búsqueda', error);
      }
    };

    // Lógica de paginación
    const paginatedResults = ref([]);
    const pageCount = ref(1);

    const updatePagination = () => {
      const startIndex = (currentPage.value - 1) * pageSize;
      paginatedResults.value = resultados.value.slice(startIndex, startIndex + pageSize);
    };

    const updatePageCount = () => {
      pageCount.value = Math.ceil(resultados.value.length / pageSize);
    };

    const changePage = (pageNumber) => {
      currentPage.value = pageNumber;
    };

    onMounted(() => {
      buscar(); // Realizar la búsqueda al cargar el componente
    });

    // Queda a la espera de los resultados, para mostrar unos datos u otros
    watch([resultados, currentPage], () => {
      updatePageCount();
      updatePagination();
    });

    return { consulta, resultados, paginatedResults, buscar, pageSize, pageCount, currentPage, changePage };
  },
};
</script>
