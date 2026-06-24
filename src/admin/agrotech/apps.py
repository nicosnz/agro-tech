from django.apps import AppConfig


class AgrotechConfig(AppConfig):
    name = 'agrotech'

    def ready(self):
        import agrotech.signals  # noqa: F401
