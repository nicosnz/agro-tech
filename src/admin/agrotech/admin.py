from django.contrib import admin
from .models import Medicamentos,TipoAlimentos,Potreros,Lotes
# Register your models here.

@admin.register(Medicamentos)
class MedicamentosAdmin(admin.ModelAdmin):
    list_display=('nombre','dosis_recomendada','precio_display','disponible')
    search_fields=('nombre',)
    readonly_fields=('creado_en','actualizado_en')

    @admin.display(description='Precio')
    def precio_display(self, obj):
        return f"Bs. {obj.precio}"

@admin.register(TipoAlimentos)
class TipoAlimentosAdmin(admin.ModelAdmin):
    list_display=('nombre','precio_display','cantidad_restante_display','disponible')
    search_fields=('nombre',)
    readonly_fields=('creado_en','actualizado_en')

    @admin.display(description='Precio')
    def precio_display(self, obj):
        return f"Bs. {obj.precio}"

    @admin.display(description='Cantidad restante')
    def cantidad_restante_display(self, obj):
        return f"{obj.cantidad_restante} kg"
    
@admin.register(Potreros)
class PotrerosAdmin(admin.ModelAdmin):
    list_display=('nombre','capacidad','ubicacion','estado')
    search_fields=('nombre',)
    list_filter=('estado',)
    readonly_fields=('creado_en','actualizado_en')
@admin.register(Lotes)
class LotesAdmin(admin.ModelAdmin):
    list_display=('nombre','tipo','cantidad_animales','fecha_creacion','activo')
    search_fields=('nombre',)
    list_filter=('tipo','activo')
    readonly_fields=('creado_en','actualizado_en')