package Ex.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";
        
        return new OpenAPI()
            .info(new Info()
                .title("University Management API")
                .version("1.0")
                .description("API для управления университетом, кампусами и пользователями")
                .contact(new Contact()
                    .name("API Support")
                    .email("support@university.com")))
            // Добавить требование безопасности ко всем эндпоинтам
            .addSecurityItem(new SecurityRequirement()
                .addList(securitySchemeName))
            // Определить схему безопасности Bearer JWT
            .components(new Components()
                .addSecuritySchemes(securitySchemeName, 
                    new SecurityScheme()
                        .name(securitySchemeName)
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("Введите JWT токен (без слова 'Bearer')")));
    }
}