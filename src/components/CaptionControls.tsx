import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Subtitles, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CaptionControlsProps {
  onCaptionChange?: (enabled: boolean, language: string) => void;
}

export const CaptionControls = ({ onCaptionChange }: CaptionControlsProps) => {
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("EN");

  const languages = [
    { code: "EN", label: "English" },
    { code: "JP", label: "Japanese" },
    { code: "SP", label: "Spanish" },
  ];

  const handleToggleCaptions = (enabled: boolean) => {
    setCaptionsEnabled(enabled);
    onCaptionChange?.(enabled, selectedLanguage);
  };

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    onCaptionChange?.(captionsEnabled, languageCode);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 relative"
        >
          <Subtitles className="h-3.5 w-3.5 mr-1.5" />
          CC
          {captionsEnabled && (
            <Badge 
              variant="secondary" 
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[8px]"
            >
              {selectedLanguage}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-3">Captions & Subtitles</h4>
            
            {/* On/Off Toggle */}
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="captions-toggle" className="text-sm cursor-pointer">
                {captionsEnabled ? "On" : "Off"}
              </Label>
              <Switch
                id="captions-toggle"
                checked={captionsEnabled}
                onCheckedChange={handleToggleCaptions}
              />
            </div>
          </div>

          <Separator />

          {/* Language Selection */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Language</Label>
            <div className="space-y-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  disabled={!captionsEnabled}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                    captionsEnabled
                      ? "hover:bg-accent cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  } ${
                    selectedLanguage === lang.code && captionsEnabled
                      ? "bg-accent"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold w-6">
                      {lang.code}
                    </span>
                    <span>{lang.label}</span>
                  </div>
                  {selectedLanguage === lang.code && captionsEnabled && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
