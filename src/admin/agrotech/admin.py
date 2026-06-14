from django.contrib import admin
from .models import Medicamentos
# Register your models here.

@admin.register(Medicamentos)
class MedicamentosAdmin(admin.ModelAdmin):
    list_display=('nombre','dosis_recomendada','precio','disponible')
    search_fields=('nombre',)
    readonly_fields=('creado_en','actualizado_en')