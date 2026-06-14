from django.contrib import admin
from .models import Medicamentos
# Register your models here.

@admin.register(Medicamentos)
class MedicamentosAdmin(admin.ModelAdmin):
    list_display=('nombre','dosis_recomendada','precio','activo')
    search_fields=('nombre',)