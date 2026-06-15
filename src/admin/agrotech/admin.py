from django.contrib import admin, messages
from django.db.models import ProtectedError
from .models import Medicamentos,TipoAlimentos,Potreros,Lotes,Bovinos,EstadosBovinos,Pesajes
# Register your models here.
class BovinosInline(admin.TabularInline):
    model = Bovinos
    extra=0
class LotesInline(admin.TabularInline):
    model=Lotes
    extra=0
class EstadoBovinoInline(admin.TabularInline):
    model=EstadosBovinos
    extra=0
class PesajesInline(admin.TabularInline):
    model=Pesajes
    extra=0
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
    inlines=[LotesInline]
    list_display=('nombre','capacidad','ubicacion','estado')
    search_fields=('nombre',)
    list_filter=('estado',)
    readonly_fields=('creado_en','actualizado_en')
@admin.register(Lotes)
class LotesAdmin(admin.ModelAdmin):
    inlines=[BovinosInline]
    list_display=('nombre','tipo','cantidad_animales','fecha_creacion','activo')
    search_fields=('nombre',)
    list_filter=('tipo','activo')
    readonly_fields=('creado_en','actualizado_en','cantidad_animales')

    def delete_model(self, request, obj):
        try:
            obj.delete()
        except ProtectedError:
            self.message_user(
                request,
                f"No se puede eliminar el lote '{obj.nombre}' porque tiene bovinos asociados.",
                level=messages.ERROR,
            )
@admin.register(Bovinos)
class BovinosAdmin(admin.ModelAdmin):
    inlines=[EstadoBovinoInline,PesajesInline]
    autocomplete_fields=['lote']
    list_display=('sexo','raza','fecha_nacimiento','lote','origen')
    search_fields=('id',)
    list_filter=('sexo','raza','lote','origen')
    readonly_fields=('creado_en','actualizado_en')

    def get_readonly_fields(self, request, obj=None):
        if obj and obj.estado_actual() in Bovinos.ESTADOS_BLOQUEADOS:
            return [f.name for f in obj._meta.fields]
        return self.readonly_fields
    
@admin.register(EstadosBovinos)
class EstadoBovinosAdmin(admin.ModelAdmin):
    list_display=('bovino','estado','fecha_registro','descripcion')
    list_filter=('estado',)
    readonly_fields=('creado_en','actualizado_en')
@admin.register(Pesajes)
class PesajesAdmin(admin.ModelAdmin):
    list_display=('fecha_pesaje','peso_display','bovino')
    search_fields=('fecha_pesaje',)
    readonly_fields=('creado_en','actualizado_en','fecha_pesaje')
    @admin.display(description='Peso')
    def peso_display(self, obj):
        return f"{obj.peso} .kg"