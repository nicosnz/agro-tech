from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from decimal import Decimal
import uuid

class TimeStampedMixin(models.Model):
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True

class UUIDMixin(models.Model):
    id=models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    
    class Meta:
        abstract=True
        
class Medicamentos(UUIDMixin,TimeStampedMixin):
    nombre=models.CharField(db_column="nombre",max_length=100,null=False)
    dosis_recomendada=models.CharField(max_length=100,null=False)
    descripcion=models.TextField(db_column="descripcion",null=True)
    precio=models.DecimalField(db_column="precio",max_digits=10,decimal_places=2,validators=[MinValueValidator(Decimal('0.01'))],help_text="Bs.")
    disponible=models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombre}, Dosis: {self.dosis_recomendada}"
    
    class Meta:
        managed=False
        db_table='"content"."medicamento"'
        verbose_name="Medicamento"
        verbose_name_plural="Medicamentos"
        
class TipoAlimentos(UUIDMixin,TimeStampedMixin):
    nombre=models.CharField(db_column="nombre",max_length=100,null=False,unique=True)
    descripcion=models.TextField(db_column="descripcion",null=True)
    precio=models.DecimalField(db_column="precio",max_digits=10,decimal_places=2,validators=[MinValueValidator(Decimal('0.01'))],help_text="Bs.")
    cantidad_restante=models.DecimalField(db_column="cantidad_restante",max_digits=10,decimal_places=2,validators=[MinValueValidator(Decimal('0.01'))],help_text="kg")
    disponible=models.BooleanField(default=True)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        managed=False
        db_table='"content"."tipoalimento"'
        verbose_name="Tipo de Alimento"
        verbose_name_plural="Tipo de Alimentos"
        
class Potreros(UUIDMixin,TimeStampedMixin):
    ESTADOS = [
        ("Disponible", "Disponible"),
        ("Ocupado", "Ocupado"),
        ("En descando", "En descanso"),
        ("Inactivo", "Inactivo")
    ]
    nombre=models.CharField(db_column="nombre",max_length=100,null=False,unique=True)
    capacidad=models.IntegerField(validators=[MinValueValidator(1)],db_column="capacidad",null=False)
    ubicacion=models.CharField(db_column="ubicacion",null=False,max_length=200)
    estado = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default='Disponible'
    )
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        managed=False
        db_table='"content"."potrero"'
        verbose_name="Potrero"
        verbose_name_plural="Potreros"
        
class Lotes(UUIDMixin,TimeStampedMixin):
    TIPOS = [
        ("Nacimiento", "Nacimiento"),
        ("Recria", "Recria"),
        ("Engore", "Engorde")
    ]
    nombre=models.CharField(db_column="nombre",max_length=100,null=False,unique=True)
    tipo = models.CharField(
        max_length=20,
        choices=TIPOS,
    )
    cantidad_animales=models.IntegerField(db_column="cantidad_animales", default=0, editable=False)
    fecha_creacion = models.DateField(null=False)
    activo=models.BooleanField(default=True)
    potrero = models.ForeignKey("Potreros",on_delete=models.PROTECT,db_column="id_potrero",related_name="lote")

    def clean(self):
        if not self.activo and self.pk and self.bovinos.exists():
            raise ValidationError("No se puede desactivar el lote porque tiene bovinos asociados.")

    def __str__(self):
        return self.nombre
    
    class Meta:
        managed=False
        db_table='"content"."lote"'
        verbose_name="Lote"
        verbose_name_plural="Lotes"
class Bovinos(UUIDMixin,TimeStampedMixin):
    RAZAS = [
        ("Nelore", "Nelore"),
        ("Brangus", "Brangus"),
        ("Brahman", "Brahman")
    ]
    SEXOS=[
        ('Macho','Macho'),
        ('Hembra','Hembra')
    ]
    ORIGENES=[
        ('Comprado','Comprado'),
        ('Nacimiento propio','Nacimiento propio')
    ]
    sexo=models.CharField(max_length=10,choices=SEXOS, null=False)
    raza = models.CharField(
        max_length=20,
        choices=RAZAS,
        null=False
    )
    fecha_nacimiento = models.DateField(null=False)
    madre=models.ForeignKey("self",null=True,blank=True,on_delete=models.SET_NULL,related_name='hijos_madre',db_column='id_madre')
    padre=models.ForeignKey("self",null=True,blank=True,on_delete=models.SET_NULL,related_name='hijos_padre',db_column='id_padre')
    lote = models.ForeignKey("Lotes",on_delete=models.PROTECT,db_column="id_lote",related_name="bovinos")
    origen=models.CharField(max_length=20,choices=ORIGENES,null=False)

    def clean(self):
        if self.origen == 'Nacimiento propio':
            errores = {}
            if not self.madre:
                errores['madre'] = 'La madre es obligatoria para bovinos de nacimiento propio.'
            if not self.padre:
                errores['padre'] = 'El padre es obligatorio para bovinos de nacimiento propio.'
            if errores:
                raise ValidationError(errores)

    def _actualizar_conteo(self, lote):
        if lote:
            lote.cantidad_animales = lote.bovinos.count()
            lote.save(update_fields=['cantidad_animales'])

    def save(self, *args, **kwargs):
        lote_anterior = None
        if self.pk:
            try:
                lote_anterior = Bovinos.objects.get(pk=self.pk).lote
            except Bovinos.DoesNotExist:
                pass
        super().save(*args, **kwargs)
        self._actualizar_conteo(self.lote)
        if lote_anterior and lote_anterior != self.lote:
            self._actualizar_conteo(lote_anterior)

    def delete(self, *args, **kwargs):
        lote = self.lote
        super().delete(*args, **kwargs)
        self._actualizar_conteo(lote)

    def __str__(self):
        return f"{self.id} - {self.raza} - {self.sexo}"
    
    class Meta:
        managed=False
        db_table='"content"."bovino"'
        verbose_name="Bovino"
        verbose_name_plural="Bovinos"