from django.contrib import admin, messages
from django.db.models import ProtectedError
from unfold.admin import ModelAdmin, TabularInline
from .models import Medicamentos,TipoAlimentos,Potreros,Lotes,Bovinos,EstadosBovinos,Pesajes,Alimentacion,Vacunacion

class BovinosInline(TabularInline):
    model = Bovinos
    extra=0
class LotesInline(TabularInline):
    model=Lotes
    extra=0
class EstadoBovinoInline(TabularInline):
    model=EstadosBovinos
    extra=0
class PesajesInline(TabularInline):
    model=Pesajes
    extra=0
class AlimentacionInline(TabularInline):
    model = Alimentacion
    extra = 0
class VacunacionInline(TabularInline):
    model=Vacunacion
    extra=0
@admin.register(Medicamentos)
class MedicamentosAdmin(ModelAdmin):
    list_display=('nombre','dosis_recomendada','precio_display','disponible')
    search_fields=('nombre',)
    readonly_fields=('creado_en','actualizado_en')

    @admin.display(description='Precio')
    def precio_display(self, obj):
        return f"Bs. {obj.precio}"

@admin.register(TipoAlimentos)
class TipoAlimentosAdmin(ModelAdmin):
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
class PotrerosAdmin(ModelAdmin):
    inlines=[LotesInline]
    list_display=('nombre','capacidad','ubicacion','estado')
    search_fields=('nombre',)
    list_filter=('estado',)
    readonly_fields=('creado_en','actualizado_en')
@admin.register(Lotes)
class LotesAdmin(ModelAdmin):
    inlines=[BovinosInline,AlimentacionInline]
    list_display=('nombre','tipo','cantidad_animales','fecha_creacion','activo','potrero')
    search_fields=('nombre',)
    list_filter=('tipo','activo')
    readonly_fields=('creado_en','actualizado_en','cantidad_animales')

    def _advertir_capacidad(self, request, potrero):
        total = sum(l.cantidad_animales for l in potrero.lote.all())
        if total > potrero.capacidad:
            self.message_user(
                request,
                f"El potrero '{potrero.nombre}' superó su capacidad ({total}/{potrero.capacidad} animales). "
                f"Se recomienda mover algunos animales a otro potrero.",
                level=messages.WARNING,
            )

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        self._advertir_capacidad(request, obj.potrero)

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
class BovinosAdmin(ModelAdmin):
    inlines=[EstadoBovinoInline,PesajesInline,VacunacionInline]
    autocomplete_fields=['lote']
    list_display=('sexo','raza','fecha_nacimiento','lote','origen')
    search_fields=('id',)
    list_filter=('sexo','raza','lote','origen')
    readonly_fields=('creado_en','actualizado_en')

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if obj.lote:
            potrero = obj.lote.potrero
            total = sum(l.cantidad_animales for l in potrero.lote.all())
            if total > potrero.capacidad:
                self.message_user(
                    request,
                    f"El potrero '{potrero.nombre}' superó su capacidad ({total}/{potrero.capacidad} animales). "
                    f"Se recomienda mover algunos animales a otro potrero.",
                    level=messages.WARNING,
                )

    def get_readonly_fields(self, request, obj=None):
        if obj and obj.estado_actual() in Bovinos.ESTADOS_BLOQUEADOS:
            return [f.name for f in obj._meta.fields]
        return self.readonly_fields
    
@admin.register(EstadosBovinos)
class EstadoBovinosAdmin(ModelAdmin):
    list_display=('bovino','estado','fecha_registro','descripcion')
    list_filter=('estado',)
    readonly_fields=('creado_en','actualizado_en')
    
@admin.register(Pesajes)
class PesajesAdmin(ModelAdmin):
    list_display=('fecha_pesaje','peso_display','bovino')
    search_fields=('fecha_pesaje',)
    readonly_fields=('creado_en','actualizado_en','fecha_pesaje')
    @admin.display(description='Peso')
    def peso_display(self, obj):
        return f"{obj.peso} .kg"
    
@admin.register(Alimentacion)
class AlimentacionAdmin(ModelAdmin):
    list_display=('fecha_alimentacion','cantidad','alimento','lote')
    search_fields=('fecha_alimentacion',)
    readonly_fields=('fecha_alimentacion','creado_en','actualizado_en')
    list_filter=('alimento',)
    @admin.display(description='Cantidad')
    def cantidad_display(self,obj):
        return f"{obj.cantidad} .kg"
@admin.register(Vacunacion)
class VacunacionAdmin(ModelAdmin):
    list_display=('fecha_aplicacion','medicamento','dosis')
    search_fields=('fecha_aplicacion',)
    readonly_fields=('fecha_aplicacion','creado_en','actualizado_en')
